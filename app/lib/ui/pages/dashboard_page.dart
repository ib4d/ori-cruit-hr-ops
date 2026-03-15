import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../providers/app_state.dart';
import '../widgets/dashboard_widgets.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final appStatus = ref.watch(appStateProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.appTitle, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          // Language Switcher
          DropdownButton<String>(
            value: appStatus.locale.languageCode,
            underline: const SizedBox(),
            items: const [
              DropdownMenuItem(value: 'en', child: Text('EN')),
              DropdownMenuItem(value: 'es', child: Text('ES')),
              DropdownMenuItem(value: 'pl', child: Text('PL')),
            ],
            onChanged: (val) {
              if (val != null) {
                ref.read(appStateProvider.notifier).setLocale(val);
              }
            },
          ),
          const SizedBox(width: 8),
          // Theme Toggle
          IconButton(
            icon: Icon(appStatus.themeMode == ThemeMode.dark ? LucideIcons.sun : LucideIcons.moon),
            onPressed: () => ref.read(appStateProvider.notifier).toggleTheme(),
          ),
          const SizedBox(width: 16),
          // Login Button
          TextButton(
            onPressed: () {},
            child: Text(l10n.login),
          ),
          const SizedBox(width: 16),
        ],
      ),
      extendBodyBehindAppBar: true,
      body: SingleChildScrollView(
        child: Column(
          children: [
            GradientHero(
              title: l10n.slogan,
              subtitle: l10n.heroSubtext,
              buttonText: l10n.getStarted,
              onButtonPressed: () {},
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 48),
                  Text(
                    "Our Features",
                    style: theme.textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 32),
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: MediaQuery.of(context).size.width > 900 ? 3 : 1,
                    mainAxisSpacing: 24,
                    crossAxisSpacing: 24,
                    childAspectRatio: 1.2,
                    children: [
                      const FeatureCard(
                        icon: LucideIcons.users,
                        title: "Automated Onboarding",
                        description: "Get new hires up to speed quickly with seamless mobile onboarding and self-service tools.",
                      ),
                      const FeatureCard(
                        icon: LucideIcons.fileText,
                        title: "Document Management",
                        description: "Store, organize, and access all employee information in one secure, GDPR-compliant place.",
                      ),
                      const FeatureCard(
                        icon: LucideIcons.shieldCheck,
                        title: "Legal Compliance",
                        description: "Built-in workflows for work permits, residence cards, and legal reviews.",
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Footer
            Container(
              padding: const EdgeInsets.all(64),
              color: theme.colorScheme.surface,
              width: double.infinity,
              child: Column(
                children: [
                  Text(l10n.appTitle, style: theme.textTheme.headlineMedium),
                  const SizedBox(height: 16),
                  const Text("© 2026 Ori-Cruit. All rights reserved."),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
