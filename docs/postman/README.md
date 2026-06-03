# iPAC Postman Collection

## Files

| File | Description |
|------|-------------|
| `iPAC-API.postman_collection.json` | All MVC controller endpoints (main + Admin area) |
| `iPAC-Local.postman_environment.json` | Local dev variables (`baseUrl`, IDs) |

## Import

1. Open Postman → **Import** → select both JSON files.
2. Select environment **iPAC Local**.
3. Set `encryptedCrmId` after copying from a CRM deep link (optional).

## Regenerate collection

When controllers change:

```powershell
.\scripts\Generate-PostmanCollection.ps1
```

## Authentication

iPAC uses **Windows Authentication** and **server session** (not JWT).

1. Log in to iPAC in the browser (same machine).
2. Use **Postman Interceptor** or import the **ASP.NET session cookie** from DevTools → Application → Cookies.
3. Without a valid session, APIs return `_Logon_` or redirect.

## Request pattern

Angular calls endpoints as:

```
POST {{baseUrl}}Opportunity/GetAll
Content-Type: application/json

{ "id": "...", "optionId": "...", "readOnly": false }
```

Parameter names in the JSON body must match MVC action parameter names (case-sensitive in some cases).

## Admin vs Angular routes

- Generated Admin routes: `Admin/{Controller}/{Action}` (e.g. `Admin/CostCurve/Batches_Read`).
- Some Angular calls use `UserDelegation/...` without `Admin/` prefix — if those fail, try `Admin/UserDelegation/...`.

## Suggested test order

1. `Opportunity/GetIBMDecryptResponse`
2. `Opportunity/GetAll`
3. `Claim/GetClaimData`
4. `Opportunity/SaveOpportunity` (minimal body — extend from Network tab capture)
5. `Opportunity/CalaculatePremium`

For `SaveOpportunity` / `PostPremium`, capture a real payload from browser DevTools and paste into Postman body.
