# API Contract: POST /auth/register

**Version**: v2 (updated for DOB field) | **Date**: 2026-04-23
**Base URL**: `localhost:8080/api/v1`
**Endpoint**: `POST /auth/register`

---

## Change Summary

`dateOfBirth` added as a **required** field to both the request body and the response payload.

---

## Request

### Headers

| Header         | Value              | Required |
|----------------|--------------------|----------|
| `Content-Type` | `application/json` | Yes      |

### Body

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "dateOfBirth": "string"
}
```

### Field Definitions

| Field             | Type   | Required | Format / Constraints                                                   |
|-------------------|--------|----------|------------------------------------------------------------------------|
| `fullName`        | string | Yes      | Non-empty; first and last name                                         |
| `email`           | string | Yes      | Valid email format; unique in system                                   |
| `password`        | string | Yes      | Min 8 chars; 1 uppercase; 1 special char; 1 digit                     |
| `confirmPassword` | string | Yes      | Must match `password`                                                  |
| `dateOfBirth`     | string | **Yes**  | `MM-DD-YYYY`; must be a past date; max 200 years before today          |

### Example Request

```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "P@ssword1",
  "confirmPassword": "P@ssword1",
  "dateOfBirth": "06-15-1990"
}
```

---

## Response

### 200 OK — Success

```json
{
  "success": true,
  "data": {
    "userId": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "dateOfBirth": "string",
    "message": "string"
  },
  "error": null,
  "meta": {
    "timestamp": "string",
    "version": "string"
  }
}
```

### Example Success Response

```json
{
  "success": true,
  "data": {
    "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "06-15-1990",
    "message": "Account created successfully."
  },
  "error": null,
  "meta": {
    "timestamp": "2026-04-23T10:00:00Z",
    "version": "1.0"
  }
}
```

### 400 Bad Request — Validation Error

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "dateOfBirth",
        "reason": "Date of birth is required."
      }
    ]
  },
  "meta": {
    "timestamp": "2026-04-23T10:00:00Z",
    "version": "1.0"
  }
}
```

### Possible Validation Error Reasons for `dateOfBirth`

| Reason                              | Condition                               |
|-------------------------------------|-----------------------------------------|
| `Date of birth is required.`        | Field is missing or empty               |
| `Date of birth cannot be a future date.` | Date is today or later           |
| `Date of birth exceeds maximum age limit.` | Date is more than 200 years ago  |
| `Invalid date format.`              | Value does not parse as a valid date    |

---

## Backend Implementation Notes

- Accept `dateOfBirth` as `DateOnly` (C#) or equivalent
- Validate server-side: required, past date, max 200 years
- Echo back `dateOfBirth` in ISO 8601 format in `RegisterResponse`
- Existing clients that do not send `dateOfBirth` should receive a `400` once this field becomes required

---

## Migration Strategy

**Phase 1 — Backend deploys with field optional**: `dateOfBirth` accepted but nullable; existing clients unaffected.
**Phase 2 — Mobile ships with field**: All new registrations include `dateOfBirth`.
**Phase 3 — Backend enforces required**: After mobile rollout is confirmed, `dateOfBirth` becomes required server-side.
