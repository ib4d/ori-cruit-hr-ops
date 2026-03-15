import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/api_service.dart';
import '../../models/candidate.dart';
import '../widgets/candidate_widgets.dart';

final candidatesProvider = FutureProvider<List<Candidate>>((ref) {
  return ref.watch(apiServiceProvider).getCandidates();
});

class PipelinePage extends ConsumerWidget {
  const PipelinePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final candidatesAsync = ref.watch(candidatesProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Candidate Pipeline"),
        actions: [
          IconButton(icon: const Icon(Icons.filter_list), onPressed: () {}),
        ],
      ),
      body: candidatesAsync.when(
        data: (candidates) => ListView.separated(
          itemCount: candidates.length,
          separatorBuilder: (_, __) => const Divider(height: 1),
          itemBuilder: (ctx, index) => CandidateCard(
            candidate: candidates[index],
            onTap: () {
              // Navigate to detail
            },
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text("Error loading candidates"),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.refresh(candidatesProvider),
                child: const Text("Retry"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
