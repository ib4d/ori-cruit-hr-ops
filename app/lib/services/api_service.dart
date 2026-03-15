import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/candidate.dart';

final apiServiceProvider = Provider((ref) => ApiService());

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://localhost:3000', // Update for prod or use env
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
  ));

  // Auth interceptor should be added here later
  
  Future<List<Candidate>> getCandidates({String? status, String? search}) async {
    try {
      final response = await _dio.get('/candidates', queryParameters: {
        if (status != null) 'status': status,
        if (search != null) 'search': search,
      });
      
      final List data = response.data;
      return data.map((json) => Candidate.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<Candidate> getCandidate(String id) async {
    try {
      final response = await _dio.get('/candidates/$id');
      return Candidate.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> updateCandidateStatus(String id, String status) async {
    try {
      await _dio.patch('/candidates/$id/status', data: {'status': status});
    } catch (e) {
      rethrow;
    }
  }
}
