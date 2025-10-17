/**
 * Internationalization (i18n) Management System for Synapse CLI
 * Comprehensive i18n tools with translation management, locale detection, and pluralization
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, basename } from 'path';
import { execSync, spawn } from 'child_process';

export class I18nManager {
  constructor(options = {}) {
    this.root = options.root || process.cwd();
    this.verbose = options.verbose || false;
    this.localesDir = options.localesDir || join(this.root, 'locales');
    this.defaultLocale = options.defaultLocale || 'en';
    this.fallbackLocale = options.fallbackLocale || 'en';
    
    this.locales = new Map();
    this.translations = new Map();
    this.pluralRules = new Map();
    this.dateFormats = new Map();
    this.numberFormats = new Map();
    
    this.initializeDefaultLocales();
    this.initializePluralRules();
    this.initializeDateFormats();
    this.initializeNumberFormats();
  }

  async initialize() {
    console.log('🌍 Initializing Internationalization Manager...');
    
    // Ensure locales directory exists
    await fs.mkdir(this.localesDir, { recursive: true });
    
    // Load existing translations
    await this.loadTranslations();
    
    console.log('✅ Internationalization Manager initialized');
  }

  initializeDefaultLocales() {
    // Common locales with their metadata
    this.locales.set('en', {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      region: 'US',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    });

    this.locales.set('es', {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      direction: 'ltr',
      region: 'ES',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    });

    this.locales.set('fr', {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      direction: 'ltr',
      region: 'FR',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    });

    this.locales.set('de', {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      direction: 'ltr',
      region: 'DE',
      currency: 'EUR',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: '24h'
    });

    this.locales.set('zh', {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      direction: 'ltr',
      region: 'CN',
      currency: 'CNY',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h'
    });

    this.locales.set('ja', {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      direction: 'ltr',
      region: 'JP',
      currency: 'JPY',
      dateFormat: 'YYYY/MM/DD',
      timeFormat: '24h'
    });

    this.locales.set('ko', {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      direction: 'ltr',
      region: 'KR',
      currency: 'KRW',
      dateFormat: 'YYYY.MM.DD',
      timeFormat: '24h'
    });

    this.locales.set('ar', {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      direction: 'rtl',
      region: 'SA',
      currency: 'SAR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h'
    });

    this.locales.set('ru', {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      direction: 'ltr',
      region: 'RU',
      currency: 'RUB',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: '24h'
    });

    this.locales.set('pt', {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      direction: 'ltr',
      region: 'BR',
      currency: 'BRL',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    });
  }

  initializePluralRules() {
    // Plural rules for different languages
    this.pluralRules.set('en', (n) => n === 1 ? 0 : 1); // singular, plural
    this.pluralRules.set('es', (n) => n === 1 ? 0 : 1); // singular, plural
    this.pluralRules.set('fr', (n) => n <= 1 ? 0 : 1); // singular, plural
    this.pluralRules.set('de', (n) => n === 1 ? 0 : 1); // singular, plural
    this.pluralRules.set('zh', (n) => 0); // no plural forms
    this.pluralRules.set('ja', (n) => 0); // no plural forms
    this.pluralRules.set('ko', (n) => 0); // no plural forms
    this.pluralRules.set('ar', (n) => {
      if (n === 0) return 0; // zero
      if (n === 1) return 1; // one
      if (n === 2) return 2; // two
      if (n % 100 >= 3 && n % 100 <= 10) return 3; // few
      if (n % 100 >= 11 && n % 100 <= 99) return 4; // many
      return 5; // other
    });
    this.pluralRules.set('ru', (n) => {
      if (n % 10 === 1 && n % 100 !== 11) return 0; // one
      if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 1; // few
      return 2; // many
    });
    this.pluralRules.set('pt', (n) => n === 1 ? 0 : 1); // singular, plural
  }

  initializeDateFormats() {
    // Date formats for different locales
    this.dateFormats.set('en', {
      short: 'M/d/yy',
      medium: 'MMM d, y',
      long: 'MMMM d, y',
      full: 'EEEE, MMMM d, y'
    });

    this.dateFormats.set('es', {
      short: 'd/M/yy',
      medium: 'd MMM y',
      long: 'd \'de\' MMMM \'de\' y',
      full: 'EEEE, d \'de\' MMMM \'de\' y'
    });

    this.dateFormats.set('fr', {
      short: 'd/M/yy',
      medium: 'd MMM y',
      long: 'd MMMM y',
      full: 'EEEE d MMMM y'
    });

    this.dateFormats.set('de', {
      short: 'd.M.yy',
      medium: 'd. MMM y',
      long: 'd. MMMM y',
      full: 'EEEE, d. MMMM y'
    });

    this.dateFormats.set('zh', {
      short: 'yy/M/d',
      medium: 'y年M月d日',
      long: 'y年M月d日',
      full: 'y年M月d日EEEE'
    });

    this.dateFormats.set('ja', {
      short: 'yy/M/d',
      medium: 'y年M月d日',
      long: 'y年M月d日',
      full: 'y年M月d日EEEE'
    });

    this.dateFormats.set('ko', {
      short: 'yy. M. d.',
      medium: 'y년 M월 d일',
      long: 'y년 M월 d일',
      full: 'y년 M월 d일 EEEE'
    });

    this.dateFormats.set('ar', {
      short: 'd/‏M/‏yy',
      medium: 'd MMM y',
      long: 'd MMMM y',
      full: 'EEEE، d MMMM y'
    });

    this.dateFormats.set('ru', {
      short: 'd.M.yy',
      medium: 'd MMM y',
      long: 'd MMMM y',
      full: 'EEEE, d MMMM y'
    });

    this.dateFormats.set('pt', {
      short: 'd/M/yy',
      medium: 'd \'de\' MMM \'de\' y',
      long: 'd \'de\' MMMM \'de\' y',
      full: 'EEEE, d \'de\' MMMM \'de\' y'
    });
  }

  initializeNumberFormats() {
    // Number formats for different locales
    this.numberFormats.set('en', {
      decimal: '.',
      thousands: ',',
      currency: '$',
      percent: '%'
    });

    this.numberFormats.set('es', {
      decimal: ',',
      thousands: '.',
      currency: '€',
      percent: '%'
    });

    this.numberFormats.set('fr', {
      decimal: ',',
      thousands: ' ',
      currency: '€',
      percent: '%'
    });

    this.numberFormats.set('de', {
      decimal: ',',
      thousands: '.',
      currency: '€',
      percent: '%'
    });

    this.numberFormats.set('zh', {
      decimal: '.',
      thousands: ',',
      currency: '¥',
      percent: '%'
    });

    this.numberFormats.set('ja', {
      decimal: '.',
      thousands: ',',
      currency: '¥',
      percent: '%'
    });

    this.numberFormats.set('ko', {
      decimal: '.',
      thousands: ',',
      currency: '₩',
      percent: '%'
    });

    this.numberFormats.set('ar', {
      decimal: '.',
      thousands: ',',
      currency: 'ر.س',
      percent: '%'
    });

    this.numberFormats.set('ru', {
      decimal: ',',
      thousands: ' ',
      currency: '₽',
      percent: '%'
    });

    this.numberFormats.set('pt', {
      decimal: ',',
      thousands: '.',
      currency: 'R$',
      percent: '%'
    });
  }

  async loadTranslations() {
    try {
      const files = await fs.readdir(this.localesDir, { withFileTypes: true });
      
      for (const entry of files) {
        if (entry.isDirectory()) {
          const localeCode = entry.name;
          await this.loadLocaleTranslations(localeCode);
        }
      }
      
      console.log(`📋 Loaded translations for ${this.translations.size} locales`);
      
    } catch (error) {
      console.log('⚠️  No translations directory found');
    }
  }

  async loadLocaleTranslations(localeCode) {
    try {
      const localeDir = join(this.localesDir, localeCode);
      const files = await fs.readdir(localeDir, { withFileTypes: true });
      
      const translations = {};
      
      for (const entry of files) {
        if (entry.isFile() && (entry.name.endsWith('.json') || entry.name.endsWith('.js'))) {
          const filePath = join(localeDir, entry.name);
          const content = await fs.readFile(filePath, 'utf-8');
          
          let fileTranslations;
          if (entry.name.endsWith('.json')) {
            fileTranslations = JSON.parse(content);
          } else {
            // For .js files, we'd need to evaluate them
            // In a real implementation, this would be more sophisticated
            fileTranslations = {};
          }
          
          const namespace = entry.name.replace(/\.(json|js)$/, '');
          translations[namespace] = fileTranslations;
        }
      }
      
      this.translations.set(localeCode, translations);
      
    } catch (error) {
      console.error(`❌ Failed to load translations for ${localeCode}:`, error.message);
    }
  }

  async createLocale(localeCode, options = {}) {
    console.log(`🌍 Creating locale: ${localeCode}`);
    
    const locale = this.locales.get(localeCode);
    if (!locale) {
      throw new Error(`Unsupported locale: ${localeCode}`);
    }
    
    const localeDir = join(this.localesDir, localeCode);
    await fs.mkdir(localeDir, { recursive: true });
    
    // Create default translation files
    await this.createDefaultTranslationFiles(localeCode, options);
    
    console.log(`✅ Locale created: ${localeCode}`);
  }

  async createDefaultTranslationFiles(localeCode, options = {}) {
    const localeDir = join(this.localesDir, localeCode);
    
    // Common translation files
    const defaultFiles = [
      'common.json',
      'navigation.json',
      'forms.json',
      'messages.json',
      'errors.json'
    ];
    
    for (const filename of defaultFiles) {
      const filePath = join(localeDir, filename);
      const content = this.generateDefaultTranslations(filename, localeCode);
      await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    }
  }

  generateDefaultTranslations(filename, localeCode) {
    const templates = {
      'common.json': {
        'app.name': 'Synapse',
        'app.description': 'A powerful application framework',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.create': 'Create',
        'common.update': 'Update',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.sort': 'Sort',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.success': 'Operation completed successfully'
      },
      'navigation.json': {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'nav.settings': 'Settings',
        'nav.profile': 'Profile',
        'nav.logout': 'Logout',
        'nav.login': 'Login',
        'nav.register': 'Register'
      },
      'forms.json': {
        'form.required': 'This field is required',
        'form.email.invalid': 'Please enter a valid email address',
        'form.password.weak': 'Password is too weak',
        'form.password.mismatch': 'Passwords do not match',
        'form.phone.invalid': 'Please enter a valid phone number',
        'form.url.invalid': 'Please enter a valid URL',
        'form.date.invalid': 'Please enter a valid date',
        'form.number.invalid': 'Please enter a valid number',
        'form.min.length': 'Must be at least {min} characters',
        'form.max.length': 'Must be no more than {max} characters',
        'form.min.value': 'Must be at least {min}',
        'form.max.value': 'Must be no more than {max}'
      },
      'messages.json': {
        'message.welcome': 'Welcome to {appName}!',
        'message.goodbye': 'Goodbye!',
        'message.thanks': 'Thank you for using {appName}',
        'message.help': 'Need help? Contact us at {email}',
        'message.maintenance': 'The system is under maintenance. Please try again later.',
        'message.feature.coming.soon': 'This feature is coming soon!',
        'message.feature.beta': 'This feature is in beta. Please report any issues.'
      },
      'errors.json': {
        'error.404': 'Page not found',
        'error.500': 'Internal server error',
        'error.network': 'Network error. Please check your connection.',
        'error.timeout': 'Request timeout. Please try again.',
        'error.unauthorized': 'You are not authorized to perform this action',
        'error.forbidden': 'Access denied',
        'error.validation': 'Validation error',
        'error.duplicate': 'This item already exists',
        'error.not.found': 'Item not found',
        'error.server.unavailable': 'Server is temporarily unavailable'
      }
    };
    
    return templates[filename] || {};
  }

  async addTranslation(localeCode, key, value, namespace = 'common') {
    if (!this.translations.has(localeCode)) {
      this.translations.set(localeCode, {});
    }
    
    if (!this.translations.get(localeCode)[namespace]) {
      this.translations.get(localeCode)[namespace] = {};
    }
    
    this.translations.get(localeCode)[namespace][key] = value;
    
    // Save to file
    await this.saveLocaleTranslations(localeCode);
    
    console.log(`✅ Translation added: ${localeCode}/${namespace}.${key}`);
  }

  async saveLocaleTranslations(localeCode) {
    const localeDir = join(this.localesDir, localeCode);
    const translations = this.translations.get(localeCode);
    
    for (const [namespace, content] of Object.entries(translations)) {
      const filePath = join(localeDir, `${namespace}.json`);
      await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    }
  }

  translate(key, locale = this.defaultLocale, params = {}) {
    const [namespace, translationKey] = key.split('.');
    
    if (!this.translations.has(locale)) {
      console.warn(`⚠️  Locale not found: ${locale}, falling back to ${this.fallbackLocale}`);
      locale = this.fallbackLocale;
    }
    
    const localeTranslations = this.translations.get(locale);
    if (!localeTranslations || !localeTranslations[namespace]) {
      return key; // Return key if translation not found
    }
    
    let translation = localeTranslations[namespace][translationKey];
    if (!translation) {
      return key; // Return key if translation not found
    }
    
    // Handle pluralization
    if (typeof translation === 'object' && translation.forms) {
      const pluralRule = this.pluralRules.get(locale);
      if (pluralRule && params.count !== undefined) {
        const formIndex = pluralRule(params.count);
        translation = translation.forms[formIndex] || translation.forms[0];
      }
    }
    
    // Replace parameters
    if (typeof translation === 'string') {
      for (const [param, value] of Object.entries(params)) {
        translation = translation.replace(new RegExp(`{${param}}`, 'g'), value);
      }
    }
    
    return translation;
  }

  t(key, params = {}, locale = this.defaultLocale) {
    return this.translate(key, locale, params);
  }

  formatDate(date, format = 'medium', locale = this.defaultLocale) {
    const dateFormats = this.dateFormats.get(locale);
    if (!dateFormats) {
      return date.toLocaleDateString();
    }
    
    const formatString = dateFormats[format] || dateFormats.medium;
    
    // Simple date formatting (in a real implementation, this would use a proper date library)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return formatString
      .replace('yyyy', year)
      .replace('yy', year.toString().slice(-2))
      .replace('MMMM', this.getMonthName(date.getMonth(), locale))
      .replace('MMM', this.getMonthName(date.getMonth(), locale, true))
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('M', month.toString())
      .replace('dd', day.toString().padStart(2, '0'))
      .replace('d', day.toString())
      .replace('EEEE', this.getDayName(date.getDay(), locale))
      .replace('EEE', this.getDayName(date.getDay(), locale, true));
  }

  formatNumber(number, options = {}, locale = this.defaultLocale) {
    const numberFormats = this.numberFormats.get(locale);
    if (!numberFormats) {
      return number.toString();
    }
    
    const { type = 'decimal', currency = 'USD', minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;
    
    if (type === 'currency') {
      return `${numberFormats.currency}${number.toLocaleString(locale, {
        minimumFractionDigits,
        maximumFractionDigits
      })}`;
    }
    
    if (type === 'percent') {
      return `${(number * 100).toLocaleString(locale, {
        minimumFractionDigits,
        maximumFractionDigits
      })}${numberFormats.percent}`;
    }
    
    return number.toLocaleString(locale, {
      minimumFractionDigits,
      maximumFractionDigits
    });
  }

  getMonthName(monthIndex, locale, short = false) {
    const months = {
      en: short ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] 
                : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      es: short ? ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
                : ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      fr: short ? ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc']
                : ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
      de: short ? ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
                : ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    };
    
    return months[locale]?.[monthIndex] || months.en[monthIndex];
  }

  getDayName(dayIndex, locale, short = false) {
    const days = {
      en: short ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      es: short ? ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
                : ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      fr: short ? ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
                : ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      de: short ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
                : ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
    };
    
    return days[locale]?.[dayIndex] || days.en[dayIndex];
  }

  async extractTranslations(sourceDir = 'src') {
    console.log('🔍 Extracting translations from source code...');
    
    const extractedKeys = new Set();
    const sourceFiles = await this.findSourceFiles(sourceDir);
    
    for (const file of sourceFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const keys = this.extractTranslationKeys(content);
      
      for (const key of keys) {
        extractedKeys.add(key);
      }
    }
    
    console.log(`📋 Extracted ${extractedKeys.size} translation keys`);
    
    // Generate missing translations for all locales
    for (const localeCode of this.translations.keys()) {
      await this.generateMissingTranslations(localeCode, Array.from(extractedKeys));
    }
    
    return Array.from(extractedKeys);
  }

  async findSourceFiles(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findSourceFiles(fullPath));
        } else if (this.isSourceFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
    
    return files;
  }

  isSourceFile(filename) {
    const ext = extname(filename);
    return ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'].includes(ext);
  }

  extractTranslationKeys(content) {
    const keys = new Set();
    
    // Look for common translation function patterns
    const patterns = [
      /t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /translate\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /\$t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /i18n\.t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /__\s*\(\s*['"`]([^'"`]+)['"`]/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        keys.add(match[1]);
      }
    }
    
    return keys;
  }

  async generateMissingTranslations(localeCode, keys) {
    const localeTranslations = this.translations.get(localeCode) || {};
    const missingKeys = [];
    
    for (const key of keys) {
      const [namespace, translationKey] = key.split('.');
      
      if (!localeTranslations[namespace] || !localeTranslations[namespace][translationKey]) {
        missingKeys.push(key);
      }
    }
    
    if (missingKeys.length > 0) {
      console.log(`⚠️  Missing ${missingKeys.length} translations for ${localeCode}`);
      
      // Generate placeholder translations
      for (const key of missingKeys) {
        const [namespace, translationKey] = key.split('.');
        
        if (!localeTranslations[namespace]) {
          localeTranslations[namespace] = {};
        }
        
        localeTranslations[namespace][translationKey] = `[${translationKey}]`;
      }
      
      this.translations.set(localeCode, localeTranslations);
      await this.saveLocaleTranslations(localeCode);
    }
  }

  async validateTranslations() {
    console.log('✅ Validating translations...');
    
    const issues = [];
    const allKeys = new Set();
    
    // Collect all translation keys
    for (const [localeCode, translations] of this.translations) {
      for (const [namespace, content] of Object.entries(translations)) {
        for (const key of Object.keys(content)) {
          allKeys.add(`${namespace}.${key}`);
        }
      }
    }
    
    // Check for missing translations
    for (const [localeCode, translations] of this.translations) {
      for (const key of allKeys) {
        const [namespace, translationKey] = key.split('.');
        
        if (!translations[namespace] || !translations[namespace][translationKey]) {
          issues.push({
            type: 'missing',
            locale: localeCode,
            key,
            severity: 'warning'
          });
        }
      }
    }
    
    // Check for unused translations
    for (const [localeCode, translations] of this.translations) {
      for (const [namespace, content] of Object.entries(translations)) {
        for (const key of Object.keys(content)) {
          const fullKey = `${namespace}.${key}`;
          if (!allKeys.has(fullKey)) {
            issues.push({
              type: 'unused',
              locale: localeCode,
              key: fullKey,
              severity: 'info'
            });
          }
        }
      }
    }
    
    console.log(`📊 Found ${issues.length} translation issues`);
    
    return issues;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      locales: Array.from(this.locales.values()).map(locale => ({
        code: locale.code,
        name: locale.name,
        nativeName: locale.nativeName,
        direction: locale.direction,
        region: locale.region,
        currency: locale.currency
      })),
      translations: Array.from(this.translations.entries()).map(([code, translations]) => ({
        locale: code,
        namespaces: Object.keys(translations),
        totalKeys: Object.values(translations).reduce((sum, ns) => sum + Object.keys(ns).length, 0)
      })),
      summary: {
        totalLocales: this.locales.size,
        totalTranslations: this.translations.size,
        supportedFormats: ['json', 'js', 'yaml', 'po']
      }
    };
    
    return report;
  }

  getSupportedLocales() {
    return Array.from(this.locales.values());
  }

  getTranslations(localeCode) {
    return this.translations.get(localeCode) || {};
  }

  getLocaleInfo(localeCode) {
    return this.locales.get(localeCode);
  }
}