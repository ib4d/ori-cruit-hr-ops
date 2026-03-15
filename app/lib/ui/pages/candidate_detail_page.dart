import 'package:flutter/material.dart';
import '../../models/candidate.dart';

class CandidateDetailPage extends StatelessWidget {
  final Candidate candidate;

  const CandidateDetailPage({super.key, required this.candidate});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(title: Text(candidate.fullName)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundColor: theme.colorScheme.primary.withOpacity(0.2),
                  child: Text(
                    candidate.firstName[0] + candidate.lastName[0],
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                  ),
                ),
                const SizedBox(width: 24),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(candidate.fullName, style: theme.textTheme.headlineMedium),
                    Text(candidate.status, style: TextStyle(color: theme.colorScheme.primary)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 48),
            _buildInfoSection(theme, "Contact Information", {
              "Email": candidate.email ?? "Not provided",
              "Phone": candidate.phone ?? "Not provided",
              "WhatsApp": candidate.whatsappNumber ?? "Not provided",
            }),
            const SizedBox(height: 32),
            _buildInfoSection(theme, "Details", {
              "Nationality": candidate.nationality ?? "N/A",
              "Country of Origin": candidate.countryOfOrigin ?? "N/A",
              "Source": candidate.source ?? "N/A",
            }),
            const SizedBox(height: 32),
            if (candidate.notes != null)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Notes", style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Text(candidate.notes!),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoSection(ThemeData theme, String title, Map<String, String> data) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
        const Divider(),
        const SizedBox(height: 12),
        ...data.entries.map((e) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(e.key, style: const TextStyle(fontWeight: FontWeight.w500)),
              Text(e.value),
            ],
          ),
        )),
      ],
    );
  }
}
