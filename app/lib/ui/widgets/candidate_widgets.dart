import 'package:flutter/material.dart';
import '../../models/candidate.dart';

class CandidateCard extends StatelessWidget {
  final Candidate candidate;
  final VoidCallback onTap;

  const CandidateCard({
    super.key,
    required this.candidate,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      title: Text(
        candidate.fullName,
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
      subtitle: Text('${candidate.nationality ?? 'N/A'} • ${candidate.status}'),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: theme.colorScheme.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          candidate.status,
          style: TextStyle(
            color: theme.colorScheme.primary,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
