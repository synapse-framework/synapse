// Mobile Development Support for Synapse Framework
export class MobileAdapter {
  constructor(platform = 'react-native') {
    this.platform = platform;
    this.isReactNative = platform === 'react-native';
    this.isFlutter = platform === 'flutter';
    this.isWeb = platform === 'web';
  }

  // Platform detection
  detectPlatform() {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('reactnative')) return 'react-native';
      if (userAgent.includes('flutter')) return 'flutter';
      return 'web';
    }
    return this.platform;
  }

  // Component adapters
  adaptComponent(component, props = {}) {
    const platform = this.detectPlatform();
    
    switch (platform) {
      case 'react-native':
        return this.adaptToReactNative(component, props);
      case 'flutter':
        return this.adaptToFlutter(component, props);
      default:
        return this.adaptToWeb(component, props);
    }
  }

  adaptToReactNative(component, props) {
    // Convert web components to React Native components
    const adaptedProps = {
      ...props,
      style: this.convertStylesToReactNative(props.className),
      onPress: props.onClick,
      onFocus: props.onFocus,
      onBlur: props.onBlur
    };

    // Remove web-specific props
    delete adaptedProps.className;
    delete adaptedProps.onClick;

    return {
      ...component,
      props: adaptedProps
    };
  }

  adaptToFlutter(component, props) {
    // Convert to Flutter widget properties
    return {
      type: this.mapComponentToFlutter(component.type),
      properties: this.convertPropsToFlutter(props)
    };
  }

  adaptToWeb(component, props) {
    // Keep as web component
    return { ...component, props };
  }

  // Style conversion
  convertStylesToReactNative(className) {
    if (!className) return {};
    
    const styleMap = {
      'px-4': { paddingHorizontal: 16 },
      'py-2': { paddingVertical: 8 },
      'px-3': { paddingHorizontal: 12 },
      'py-1': { paddingVertical: 4 },
      'px-6': { paddingHorizontal: 24 },
      'py-3': { paddingVertical: 12 },
      'text-sm': { fontSize: 14 },
      'text-base': { fontSize: 16 },
      'text-lg': { fontSize: 18 },
      'font-medium': { fontWeight: '500' },
      'font-semibold': { fontWeight: '600' },
      'font-bold': { fontWeight: '700' },
      'text-center': { textAlign: 'center' },
      'text-left': { textAlign: 'left' },
      'text-right': { textAlign: 'right' },
      'bg-blue-600': { backgroundColor: '#2563eb' },
      'bg-gray-200': { backgroundColor: '#e5e7eb' },
      'bg-white': { backgroundColor: '#ffffff' },
      'text-white': { color: '#ffffff' },
      'text-gray-900': { color: '#1f2937' },
      'text-gray-700': { color: '#374151' },
      'text-gray-600': { color: '#4b5563' },
      'text-gray-500': { color: '#6b7280' },
      'rounded': { borderRadius: 4 },
      'rounded-md': { borderRadius: 6 },
      'rounded-lg': { borderRadius: 8 },
      'rounded-full': { borderRadius: 9999 },
      'border': { borderWidth: 1 },
      'border-gray-300': { borderColor: '#d1d5db' },
      'shadow-sm': { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
      'shadow-md': { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
      'shadow-lg': { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 5 },
      'flex': { display: 'flex' },
      'flex-row': { flexDirection: 'row' },
      'flex-col': { flexDirection: 'column' },
      'items-center': { alignItems: 'center' },
      'justify-center': { justifyContent: 'center' },
      'justify-between': { justifyContent: 'space-between' },
      'space-x-2': { marginHorizontal: 4 },
      'space-x-4': { marginHorizontal: 8 },
      'space-y-2': { marginVertical: 4 },
      'space-y-4': { marginVertical: 8 },
      'w-full': { width: '100%' },
      'h-full': { height: '100%' },
      'min-h-screen': { minHeight: '100vh' },
      'p-4': { padding: 16 },
      'p-6': { padding: 24 },
      'm-4': { margin: 16 },
      'm-6': { margin: 24 },
      'mt-4': { marginTop: 16 },
      'mb-4': { marginBottom: 16 },
      'ml-4': { marginLeft: 16 },
      'mr-4': { marginRight: 16 }
    };

    const classes = className.split(' ');
    const styles = {};
    
    classes.forEach(cls => {
      if (styleMap[cls]) {
        Object.assign(styles, styleMap[cls]);
      }
    });

    return styles;
  }

  convertPropsToFlutter(props) {
    const flutterProps = {};
    
    // Convert common props
    if (props.children) flutterProps.child = props.children;
    if (props.onClick) flutterProps.onPressed = props.onClick;
    if (props.className) flutterProps.style = this.convertStylesToFlutter(props.className);
    
    return flutterProps;
  }

  convertStylesToFlutter(className) {
    // Convert CSS classes to Flutter style properties
    const styleMap = {
      'px-4': 'EdgeInsets.symmetric(horizontal: 16)',
      'py-2': 'EdgeInsets.symmetric(vertical: 8)',
      'text-sm': 'TextStyle(fontSize: 14)',
      'text-base': 'TextStyle(fontSize: 16)',
      'font-medium': 'FontWeight.w500',
      'bg-blue-600': 'Colors.blue[600]',
      'text-white': 'Colors.white'
    };

    const classes = className.split(' ');
    return classes.map(cls => styleMap[cls] || cls).join(', ');
  }

  mapComponentToFlutter(componentType) {
    const flutterMap = {
      'Button': 'ElevatedButton',
      'Input': 'TextField',
      'Card': 'Card',
      'Modal': 'AlertDialog',
      'Toast': 'SnackBar',
      'Table': 'DataTable',
      'Dropdown': 'DropdownButton',
      'Accordion': 'ExpansionTile'
    };

    return flutterMap[componentType] || componentType;
  }

  // Navigation
  createNavigation(navigationConfig) {
    const platform = this.detectPlatform();
    
    switch (platform) {
      case 'react-native':
        return this.createReactNativeNavigation(navigationConfig);
      case 'flutter':
        return this.createFlutterNavigation(navigationConfig);
      default:
        return this.createWebNavigation(navigationConfig);
    }
  }

  createReactNativeNavigation(config) {
    // React Native Navigation setup
    return {
      type: 'react-navigation',
      config: {
        ...config,
        screenOptions: {
          headerStyle: {
            backgroundColor: '#2563eb'
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }
      }
    };
  }

  createFlutterNavigation(config) {
    // Flutter Navigation setup
    return {
      type: 'flutter-navigation',
      config: {
        ...config,
        theme: {
          primaryColor: 'Colors.blue[600]',
          textTheme: 'TextTheme(bodyLarge: TextStyle(color: Colors.white))'
        }
      }
    };
  }

  createWebNavigation(config) {
    // Web Navigation setup
    return {
      type: 'web-navigation',
      config: {
        ...config,
        style: {
          backgroundColor: '#2563eb',
          color: '#ffffff'
        }
      }
    };
  }

  // State management
  createStateManager(initialState = {}) {
    const platform = this.detectPlatform();
    
    switch (platform) {
      case 'react-native':
        return this.createReactNativeStateManager(initialState);
      case 'flutter':
        return this.createFlutterStateManager(initialState);
      default:
        return this.createWebStateManager(initialState);
    }
  }

  createReactNativeStateManager(initialState) {
    // React Native state management (using React hooks)
    return {
      type: 'react-hooks',
      initialState,
      hooks: {
        useState: 'useState',
        useEffect: 'useEffect',
        useContext: 'useContext',
        useReducer: 'useReducer'
      }
    };
  }

  createFlutterStateManager(initialState) {
    // Flutter state management (using Provider/Riverpod)
    return {
      type: 'flutter-provider',
      initialState,
      providers: {
        ChangeNotifier: 'ChangeNotifierProvider',
        StateNotifier: 'StateNotifierProvider',
        Consumer: 'Consumer'
      }
    };
  }

  createWebStateManager(initialState) {
    // Web state management
    return {
      type: 'web-state',
      initialState,
      methods: {
        setState: 'setState',
        getState: 'getState',
        subscribe: 'subscribe'
      }
    };
  }

  // API integration
  createApiClient(baseURL, options = {}) {
    const platform = this.detectPlatform();
    
    const defaultOptions = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    };

    switch (platform) {
      case 'react-native':
        return this.createReactNativeApiClient(baseURL, defaultOptions);
      case 'flutter':
        return this.createFlutterApiClient(baseURL, defaultOptions);
      default:
        return this.createWebApiClient(baseURL, defaultOptions);
    }
  }

  createReactNativeApiClient(baseURL, options) {
    return {
      type: 'react-native-fetch',
      baseURL,
      options,
      methods: {
        get: 'fetch',
        post: 'fetch',
        put: 'fetch',
        delete: 'fetch'
      }
    };
  }

  createFlutterApiClient(baseURL, options) {
    return {
      type: 'flutter-http',
      baseURL,
      options,
      methods: {
        get: 'http.get',
        post: 'http.post',
        put: 'http.put',
        delete: 'http.delete'
      }
    };
  }

  createWebApiClient(baseURL, options) {
    return {
      type: 'web-fetch',
      baseURL,
      options,
      methods: {
        get: 'fetch',
        post: 'fetch',
        put: 'fetch',
        delete: 'fetch'
      }
    };
  }

  // Storage
  createStorage(storageType = 'async') {
    const platform = this.detectPlatform();
    
    switch (platform) {
      case 'react-native':
        return this.createReactNativeStorage(storageType);
      case 'flutter':
        return this.createFlutterStorage(storageType);
      default:
        return this.createWebStorage(storageType);
    }
  }

  createReactNativeStorage(type) {
    const storageMap = {
      async: 'AsyncStorage',
      secure: 'Keychain',
      sqlite: 'SQLite'
    };

    return {
      type: storageMap[type] || 'AsyncStorage',
      methods: {
        getItem: 'getItem',
        setItem: 'setItem',
        removeItem: 'removeItem',
        clear: 'clear'
      }
    };
  }

  createFlutterStorage(type) {
    const storageMap = {
      async: 'SharedPreferences',
      secure: 'FlutterSecureStorage',
      sqlite: 'Sqflite'
    };

    return {
      type: storageMap[type] || 'SharedPreferences',
      methods: {
        getString: 'getString',
        setString: 'setString',
        remove: 'remove',
        clear: 'clear'
      }
    };
  }

  createWebStorage(type) {
    const storageMap = {
      async: 'localStorage',
      secure: 'sessionStorage',
      sqlite: 'IndexedDB'
    };

    return {
      type: storageMap[type] || 'localStorage',
      methods: {
        getItem: 'getItem',
        setItem: 'setItem',
        removeItem: 'removeItem',
        clear: 'clear'
      }
    };
  }
}

// Mobile-specific components
export class MobileButton {
  constructor(options = {}) {
    this.platform = options.platform || 'react-native';
    this.adapter = new MobileAdapter(this.platform);
    this.props = options;
  }

  render() {
    return this.adapter.adaptComponent('Button', this.props);
  }
}

export class MobileInput {
  constructor(options = {}) {
    this.platform = options.platform || 'react-native';
    this.adapter = new MobileAdapter(this.platform);
    this.props = options;
  }

  render() {
    return this.adapter.adaptComponent('Input', this.props);
  }
}

export class MobileCard {
  constructor(options = {}) {
    this.platform = options.platform || 'react-native';
    this.adapter = new MobileAdapter(this.platform);
    this.props = options;
  }

  render() {
    return this.adapter.adaptComponent('Card', this.props);
  }
}

// Mobile utilities
export const mobileUtils = {
  // Platform detection
  isReactNative: () => typeof navigator !== 'undefined' && navigator.userAgent.includes('ReactNative'),
  isFlutter: () => typeof navigator !== 'undefined' && navigator.userAgent.includes('Flutter'),
  isWeb: () => typeof window !== 'undefined',
  
  // Device info
  getDeviceInfo: () => {
    if (typeof navigator !== 'undefined') {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      };
    }
    return {};
  },
  
  // Screen dimensions
  getScreenDimensions: () => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      };
    }
    return { width: 0, height: 0, devicePixelRatio: 1 };
  },
  
  // Responsive breakpoints
  getBreakpoint: (width) => {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    };
    
    for (const [name, breakpoint] of Object.entries(breakpoints)) {
      if (width < breakpoint) {
        return name;
      }
    }
    
    return '2xl';
  }
};

// Default export
export default {
  MobileAdapter,
  MobileButton,
  MobileInput,
  MobileCard,
  mobileUtils
};