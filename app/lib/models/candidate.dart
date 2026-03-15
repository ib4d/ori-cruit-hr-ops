import 'package:json_annotation/json_annotation.dart';

part 'candidate.g.dart';

@JsonSerializable()
class Candidate {
  final String id;
  final String firstName;
  final String lastName;
  final String? email;
  final String? phone;
  final String? whatsappNumber;
  final String? nationality;
  final String? countryOfOrigin;
  final String status;
  final String? source;
  final String? hrappkaId;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  Candidate({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.email,
    this.phone,
    this.whatsappNumber,
    this.nationality,
    this.countryOfOrigin,
    required this.status,
    this.source,
    this.hrappkaId,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  String get fullName => '$firstName $lastName';

  factory Candidate.fromJson(Map<String, dynamic> json) => _$CandidateFromJson(json);
  Map<String, dynamic> toJson() => _$CandidateToJson(this);
}

enum CandidateStatus {
  LEAD,
  SURVEY_PENDING,
  SURVEY_DONE,
  DOCS_PENDING,
  DOCS_SUBMITTED,
  LEGAL_REVIEW,
  LEGAL_APPROVED,
  LEGAL_REJECTED,
  PAYMENT_PENDING,
  PAYMENT_DONE,
  ASSIGNED,
  ACTIVE,
  CLOSED_SUCCESS,
  CLOSED_NO_SHOW,
  CLOSED_ABANDONED
}
