// GENERATED CODE - DO NOT MODIFY BY HAND
part of 'candidate.dart';

Candidate _$CandidateFromJson(Map<String, dynamic> json) => Candidate(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      whatsappNumber: json['whatsappNumber'] as String?,
      nationality: json['nationality'] as String?,
      countryOfOrigin: json['countryOfOrigin'] as String?,
      status: json['status'] as String,
      source: json['source'] as String?,
      hrappkaId: json['hrappkaId'] as String?,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$CandidateToJson(Candidate instance) => <String, dynamic>{
      'id': instance.id,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'email': instance.email,
      'phone': instance.phone,
      'whatsappNumber': instance.whatsappNumber,
      'nationality': instance.nationality,
      'countryOfOrigin': instance.countryOfOrigin,
      'status': instance.status,
      'source': instance.source,
      'hrappkaId': instance.hrappkaId,
      'notes': instance.notes,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
