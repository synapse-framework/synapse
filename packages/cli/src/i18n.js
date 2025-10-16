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

  // ========================================================================
  // ENHANCED I18N FEATURES
  // ========================================================================

  async detectLocale(options = {}) {
    console.log('🔍 Detecting user locale...');
    
    const detectionMethods = [
      () => this.detectFromEnvironment(),
      () => this.detectFromBrowser(),
      () => this.detectFromSystem(),
      () => this.detectFromIP(options.ip)
    ];
    
    for (const method of detectionMethods) {
      try {
        const locale = await method();
        if (locale && this.locales.has(locale)) {
          console.log(`✅ Detected locale: ${locale}`);
          return locale;
        }
      } catch (error) {
        // Continue to next method
      }
    }
    
    console.log(`⚠️  Could not detect locale, using default: ${this.defaultLocale}`);
    return this.defaultLocale;
  }

  detectFromEnvironment() {
    return process.env.LANG?.split('.')[0] || process.env.LC_ALL?.split('.')[0];
  }

  detectFromBrowser() {
    // In a real implementation, this would use browser APIs
    return null;
  }

  detectFromSystem() {
    try {
      const result = execSync('locale', { encoding: 'utf-8', timeout: 5000 });
      const match = result.match(/LANG=([^.]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  async detectFromIP(ip) {
    if (!ip) return null;
    
    try {
      // In a real implementation, this would use a geolocation service
      // For now, return null
      return null;
    } catch {
      return null;
    }
  }

  async addLocale(localeCode, localeInfo) {
    console.log(`🌍 Adding new locale: ${localeCode}`);
    
    const locale = {
      code: localeCode,
      name: localeInfo.name || localeCode,
      nativeName: localeInfo.nativeName || localeInfo.name || localeCode,
      direction: localeInfo.direction || 'ltr',
      region: localeInfo.region || localeCode.split('-')[1] || localeCode,
      currency: localeInfo.currency || 'USD',
      dateFormat: localeInfo.dateFormat || 'MM/DD/YYYY',
      timeFormat: localeInfo.timeFormat || '12h',
      ...localeInfo
    };
    
    this.locales.set(localeCode, locale);
    
    // Initialize plural rules if not provided
    if (!this.pluralRules.has(localeCode)) {
      this.pluralRules.set(localeCode, (n) => n === 1 ? 0 : 1); // Default to English plural rule
    }
    
    // Initialize date formats if not provided
    if (!this.dateFormats.has(localeCode)) {
      this.dateFormats.set(localeCode, {
        short: 'M/d/yy',
        medium: 'MMM d, y',
        long: 'MMMM d, y',
        full: 'EEEE, MMMM d, y'
      });
    }
    
    // Initialize number formats if not provided
    if (!this.numberFormats.has(localeCode)) {
      this.numberFormats.set(localeCode, {
        decimal: '.',
        thousands: ',',
        currency: '$',
        percent: '%'
      });
    }
    
    // Create locale directory and default files
    await this.createLocale(localeCode, localeInfo);
    
    console.log(`✅ Locale added: ${localeCode}`);
    
    return locale;
  }

  async removeLocale(localeCode) {
    console.log(`🗑️  Removing locale: ${localeCode}`);
    
    if (localeCode === this.defaultLocale) {
      throw new Error('Cannot remove default locale');
    }
    
    // Remove from maps
    this.locales.delete(localeCode);
    this.translations.delete(localeCode);
    this.pluralRules.delete(localeCode);
    this.dateFormats.delete(localeCode);
    this.numberFormats.delete(localeCode);
    
    // Remove locale directory
    const localeDir = join(this.localesDir, localeCode);
    try {
      await fs.rm(localeDir, { recursive: true, force: true });
    } catch (error) {
      console.warn(`⚠️  Could not remove locale directory: ${error.message}`);
    }
    
    console.log(`✅ Locale removed: ${localeCode}`);
  }

  async importTranslations(localeCode, filePath, format = 'auto') {
    console.log(`📥 Importing translations for ${localeCode} from ${filePath}`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    let translations;
    
    if (format === 'auto') {
      format = this.detectFileFormat(filePath);
    }
    
    switch (format) {
      case 'json':
        translations = JSON.parse(content);
        break;
      case 'yaml':
        translations = await this.parseYAML(content);
        break;
      case 'po':
        translations = await this.parsePO(content);
        break;
      case 'csv':
        translations = await this.parseCSV(content);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    // Merge with existing translations
    const existingTranslations = this.translations.get(localeCode) || {};
    const mergedTranslations = this.mergeTranslations(existingTranslations, translations);
    
    this.translations.set(localeCode, mergedTranslations);
    await this.saveLocaleTranslations(localeCode);
    
    console.log(`✅ Translations imported for ${localeCode}`);
    
    return translations;
  }

  async exportTranslations(localeCode, filePath, format = 'auto') {
    console.log(`📤 Exporting translations for ${localeCode} to ${filePath}`);
    
    const translations = this.translations.get(localeCode);
    if (!translations) {
      throw new Error(`No translations found for locale: ${localeCode}`);
    }
    
    if (format === 'auto') {
      format = this.detectFileFormat(filePath);
    }
    
    let content;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(translations, null, 2);
        break;
      case 'yaml':
        content = await this.stringifyYAML(translations);
        break;
      case 'po':
        content = await this.stringifyPO(translations, localeCode);
        break;
      case 'csv':
        content = await this.stringifyCSV(translations);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    await fs.writeFile(filePath, content);
    
    console.log(`✅ Translations exported for ${localeCode}`);
  }

  detectFileFormat(filePath) {
    const ext = extname(filePath).toLowerCase();
    const formatMap = {
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.po': 'po',
      '.pot': 'po',
      '.csv': 'csv'
    };
    
    return formatMap[ext] || 'json';
  }

  async parseYAML(content) {
    // In a real implementation, this would use a YAML parser
    // For now, return empty object
    return {};
  }

  async parsePO(content) {
    // In a real implementation, this would parse PO files
    // For now, return empty object
    return {};
  }

  async parseCSV(content) {
    const lines = content.split('\n');
    const translations = {};
    
    for (let i = 1; i < lines.length; i++) { // Skip header
      const [namespace, key, value] = lines[i].split(',');
      if (namespace && key && value) {
        if (!translations[namespace]) {
          translations[namespace] = {};
        }
        translations[namespace][key] = value;
      }
    }
    
    return translations;
  }

  async stringifyYAML(translations) {
    // In a real implementation, this would use a YAML stringifier
    return JSON.stringify(translations, null, 2);
  }

  async stringifyPO(translations, localeCode) {
    // In a real implementation, this would generate PO files
    return `# ${localeCode} translations\n# Generated by Synapse i18n\n`;
  }

  async stringifyCSV(translations) {
    const lines = ['namespace,key,value'];
    
    for (const [namespace, content] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(content)) {
        lines.push(`${namespace},${key},"${value}"`);
      }
    }
    
    return lines.join('\n');
  }

  mergeTranslations(existing, imported) {
    const merged = { ...existing };
    
    for (const [namespace, content] of Object.entries(imported)) {
      if (!merged[namespace]) {
        merged[namespace] = {};
      }
      
      for (const [key, value] of Object.entries(content)) {
        merged[namespace][key] = value;
      }
    }
    
    return merged;
  }

  // ========================================================================
  // TRANSLATION MANAGEMENT
  // ========================================================================

  async syncTranslations(sourceLocale = 'en') {
    console.log(`🔄 Syncing translations from ${sourceLocale}...`);
    
    const sourceTranslations = this.translations.get(sourceLocale);
    if (!sourceTranslations) {
      throw new Error(`Source locale not found: ${sourceLocale}`);
    }
    
    const allKeys = this.getAllTranslationKeys(sourceTranslations);
    
    for (const [localeCode, translations] of this.translations) {
      if (localeCode === sourceLocale) continue;
      
      const missingKeys = this.findMissingKeys(translations, allKeys);
      
      if (missingKeys.length > 0) {
        console.log(`📝 Adding ${missingKeys.length} missing keys to ${localeCode}`);
        
        for (const key of missingKeys) {
          const [namespace, translationKey] = key.split('.');
          
          if (!translations[namespace]) {
            translations[namespace] = {};
          }
          
          // Copy from source locale
          translations[namespace][translationKey] = sourceTranslations[namespace][translationKey];
        }
        
        await this.saveLocaleTranslations(localeCode);
      }
    }
    
    console.log(`✅ Translation sync completed`);
  }

  getAllTranslationKeys(translations) {
    const keys = [];
    
    for (const [namespace, content] of Object.entries(translations)) {
      for (const key of Object.keys(content)) {
        keys.push(`${namespace}.${key}`);
      }
    }
    
    return keys;
  }

  findMissingKeys(translations, allKeys) {
    const missingKeys = [];
    
    for (const key of allKeys) {
      const [namespace, translationKey] = key.split('.');
      
      if (!translations[namespace] || !translations[namespace][translationKey]) {
        missingKeys.push(key);
      }
    }
    
    return missingKeys;
  }

  async generateTranslationKeys(sourceDir = 'src') {
    console.log('🔑 Generating translation keys...');
    
    const keys = await this.extractTranslations(sourceDir);
    const keyMap = new Map();
    
    for (const key of keys) {
      const [namespace, translationKey] = key.split('.');
      
      if (!keyMap.has(namespace)) {
        keyMap.set(namespace, []);
      }
      
      keyMap.get(namespace).push(translationKey);
    }
    
    // Generate key files for each namespace
    for (const [namespace, translationKeys] of keyMap) {
      const keyFile = join(this.root, 'locales', 'keys', `${namespace}.json`);
      await fs.mkdir(dirname(keyFile), { recursive: true });
      
      const keyObject = {};
      for (const key of translationKeys) {
        keyObject[key] = key; // Use key as value for reference
      }
      
      await fs.writeFile(keyFile, JSON.stringify(keyObject, null, 2));
    }
    
    console.log(`✅ Generated ${keys.length} translation keys`);
    
    return keys;
  }

  async validateTranslationConsistency() {
    console.log('🔍 Validating translation consistency...');
    
    const issues = [];
    const allKeys = new Set();
    const localeKeys = new Map();
    
    // Collect all keys from all locales
    for (const [localeCode, translations] of this.translations) {
      const keys = new Set();
      
      for (const [namespace, content] of Object.entries(translations)) {
        for (const key of Object.keys(content)) {
          const fullKey = `${namespace}.${key}`;
          keys.add(fullKey);
          allKeys.add(fullKey);
        }
      }
      
      localeKeys.set(localeCode, keys);
    }
    
    // Check for missing keys in each locale
    for (const [localeCode, keys] of localeKeys) {
      for (const key of allKeys) {
        if (!keys.has(key)) {
          issues.push({
            type: 'missing',
            locale: localeCode,
            key,
            severity: 'warning'
          });
        }
      }
    }
    
    // Check for unused keys
    for (const [localeCode, keys] of localeKeys) {
      for (const key of keys) {
        if (!allKeys.has(key)) {
          issues.push({
            type: 'unused',
            locale: localeCode,
            key,
            severity: 'info'
          });
        }
      }
    }
    
    console.log(`📊 Found ${issues.length} consistency issues`);
    
    return issues;
  }

  // ========================================================================
  // ADVANCED FORMATTING
  // ========================================================================

  formatRelativeTime(date, locale = this.defaultLocale) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    const relativeTimeKeys = {
      en: {
        now: 'just now',
        seconds: '{count} second ago',
        seconds_plural: '{count} seconds ago',
        minutes: '{count} minute ago',
        minutes_plural: '{count} minutes ago',
        hours: '{count} hour ago',
        hours_plural: '{count} hours ago',
        days: '{count} day ago',
        days_plural: '{count} days ago'
      },
      es: {
        now: 'ahora mismo',
        seconds: 'hace {count} segundo',
        seconds_plural: 'hace {count} segundos',
        minutes: 'hace {count} minuto',
        minutes_plural: 'hace {count} minutos',
        hours: 'hace {count} hora',
        hours_plural: 'hace {count} horas',
        days: 'hace {count} día',
        days_plural: 'hace {count} días'
      }
    };
    
    const keys = relativeTimeKeys[locale] || relativeTimeKeys.en;
    
    if (seconds < 60) {
      return keys.now;
    } else if (minutes < 60) {
      return this.t(keys.minutes, { count: minutes }, locale);
    } else if (hours < 24) {
      return this.t(keys.hours, { count: hours }, locale);
    } else {
      return this.t(keys.days, { count: days }, locale);
    }
  }

  formatCurrency(amount, currency = 'USD', locale = this.defaultLocale) {
    const numberFormats = this.numberFormats.get(locale);
    if (!numberFormats) {
      return `${currency} ${amount.toFixed(2)}`;
    }
    
    const formattedAmount = amount.toLocaleString(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formattedAmount;
  }

  formatOrdinal(number, locale = this.defaultLocale) {
    const ordinalRules = {
      en: (n) => {
        const s = n.toString();
        const lastDigit = s[s.length - 1];
        const lastTwoDigits = s.slice(-2);
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
          return s + 'th';
        }
        
        switch (lastDigit) {
          case '1': return s + 'st';
          case '2': return s + 'nd';
          case '3': return s + 'rd';
          default: return s + 'th';
        }
      },
      es: (n) => n + 'º',
      fr: (n) => n + 'e',
      de: (n) => n + '.'
    };
    
    const rule = ordinalRules[locale] || ordinalRules.en;
    return rule(number);
  }

  // ========================================================================
  // TRANSLATION QUALITY ASSURANCE
  // ========================================================================

  async checkTranslationQuality(localeCode) {
    console.log(`🔍 Checking translation quality for ${localeCode}...`);
    
    const issues = [];
    const translations = this.translations.get(localeCode);
    
    if (!translations) {
      return issues;
    }
    
    for (const [namespace, content] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(content)) {
        const qualityIssues = this.analyzeTranslationQuality(key, value, localeCode);
        issues.push(...qualityIssues);
      }
    }
    
    console.log(`📊 Found ${issues.length} quality issues for ${localeCode}`);
    
    return issues;
  }

  analyzeTranslationQuality(key, value, localeCode) {
    const issues = [];
    
    // Check for placeholder translations
    if (value.startsWith('[') && value.endsWith(']')) {
      issues.push({
        type: 'placeholder',
        key,
        value,
        severity: 'warning',
        message: 'Translation appears to be a placeholder'
      });
    }
    
    // Check for missing parameters
    const paramPattern = /\{[^}]+\}/g;
    const params = value.match(paramPattern) || [];
    
    if (params.length > 0) {
      // Check if parameters are properly formatted
      for (const param of params) {
        if (!/^\{[a-zA-Z_][a-zA-Z0-9_]*\}$/.test(param)) {
          issues.push({
            type: 'invalid_parameter',
            key,
            value,
            severity: 'error',
            message: `Invalid parameter format: ${param}`
          });
        }
      }
    }
    
    // Check for HTML tags in translations
    if (/<[^>]+>/.test(value)) {
      issues.push({
        type: 'html_tags',
        key,
        value,
        severity: 'warning',
        message: 'Translation contains HTML tags'
      });
    }
    
    // Check for very long translations
    if (value.length > 500) {
      issues.push({
        type: 'too_long',
        key,
        value,
        severity: 'warning',
        message: 'Translation is very long'
      });
    }
    
    // Check for very short translations
    if (value.length < 3) {
      issues.push({
        type: 'too_short',
        key,
        value,
        severity: 'warning',
        message: 'Translation is very short'
      });
    }
    
    return issues;
  }

  async generateTranslationReport() {
    console.log('📊 Generating translation report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      locales: [],
      quality: {},
      coverage: {},
      summary: {
        totalLocales: this.locales.size,
        totalTranslations: this.translations.size,
        averageCoverage: 0,
        qualityScore: 0
      }
    };
    
    let totalCoverage = 0;
    let totalQuality = 0;
    
    for (const [localeCode, translations] of this.translations) {
      const localeInfo = this.locales.get(localeCode);
      const qualityIssues = await this.checkTranslationQuality(localeCode);
      const coverage = this.calculateCoverage(localeCode);
      
      report.locales.push({
        code: localeCode,
        name: localeInfo?.name || localeCode,
        coverage: coverage.percentage,
        qualityIssues: qualityIssues.length,
        totalKeys: Object.values(translations).reduce((sum, ns) => sum + Object.keys(ns).length, 0)
      });
      
      report.quality[localeCode] = qualityIssues;
      report.coverage[localeCode] = coverage;
      
      totalCoverage += coverage.percentage;
      totalQuality += Math.max(0, 100 - qualityIssues.length);
    }
    
    report.summary.averageCoverage = totalCoverage / this.translations.size;
    report.summary.qualityScore = totalQuality / this.translations.size;
    
    console.log(`✅ Translation report generated`);
    
    return report;
  }

  calculateCoverage(localeCode) {
    const translations = this.translations.get(localeCode);
    if (!translations) {
      return { percentage: 0, missing: 0, total: 0 };
    }
    
    const allKeys = this.getAllTranslationKeys(translations);
    const missingKeys = this.findMissingKeys(translations, allKeys);
    
    return {
      percentage: Math.round(((allKeys.length - missingKeys.length) / allKeys.length) * 100),
      missing: missingKeys.length,
      total: allKeys.length
    };
  }
}