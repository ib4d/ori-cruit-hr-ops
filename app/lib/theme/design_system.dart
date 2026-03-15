import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Brand Colors
  static const Color primary = Color(0xFF00D4AA);
  static const Color accent = Color(0xFFC9A84C);
  
  // Theme: Midnight Luxe (Dark)
  static const Color darkBackground = Color(0xFF0D0D12);
  static const Color darkSurface = Color(0xFF18181B);
  static const Color darkText = Color(0xFFFAF8F5);
  static const Color darkSubtext = Color(0xFF94A3B8);
  
  // Theme: Pulse (Light)
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Colors.white;
  static const Color lightText = Color(0xFF1A1A1A);
  static const Color lightSubtext = Color(0xFF64748B);
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.accent,
        background: AppColors.darkBackground,
        surface: AppColors.darkSurface,
        onBackground: AppColors.darkText,
        onSurface: AppColors.darkText,
      ),
      scaffoldBackgroundColor: AppColors.darkBackground,
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.instrumentSerif(
          fontSize: 64,
          fontStyle: FontStyle.italic,
          color: AppColors.primary,
        ),
      ),
      cardTheme: CardTheme(
        color: AppColors.darkSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        elevation: 0,
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.accent,
        background: AppColors.lightBackground,
        surface: AppColors.lightSurface,
        onBackground: AppColors.lightText,
        onSurface: AppColors.lightText,
      ),
      scaffoldBackgroundColor: AppColors.lightBackground,
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
      cardTheme: CardTheme(
        color: AppColors.lightSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        elevation: 2,
        shadowColor: Colors.black.withOpacity(0.05),
      ),
    );
  }
}
