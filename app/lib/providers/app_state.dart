import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final appStateProvider = StateNotifierProvider<AppStateNotifier, AppState>((ref) {
  return AppStateNotifier();
});

class AppState {
  final ThemeMode themeMode;
  final Locale locale;

  AppState({
    required this.themeMode,
    required this.locale,
  });

  AppState copyWith({
    ThemeMode? themeMode,
    Locale? locale,
  }) {
    return AppState(
      themeMode: themeMode ?? this.themeMode,
      locale: locale ?? this.locale,
    );
  }
}

class AppStateNotifier extends StateNotifier<AppState> {
  AppStateNotifier()
      : super(AppState(themeMode: ThemeMode.dark, locale: const Locale('en'))) {
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    final isDark = prefs.getBool('isDark') ?? true;
    final lang = prefs.getString('language') ?? 'en';
    
    state = state.copyWith(
      themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
      locale: Locale(lang),
    );
  }

  Future<void> toggleTheme() async {
    final newMode = state.themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    state = state.copyWith(themeMode: newMode);
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDark', newMode == ThemeMode.dark);
  }

  Future<void> setLocale(String languageCode) async {
    state = state.copyWith(locale: Locale(languageCode));
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('language', languageCode);
  }
}
