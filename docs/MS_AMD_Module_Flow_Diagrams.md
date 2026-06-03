# MS&AMD Module Flow Diagrams

Sequence and flow diagrams derived from **MS&AMD_Module_Flow_Presentation.pptx** — Saudi Aramco MS&AMD (Medical Services & Affiliation Management Department) and BUPA Arabia Automated Communication System.

---

## 1. System Overview & User Roles

```mermaid
flowchart TB
    subgraph Aramco["Aramco Users"]
        MSMD["MSMD User (New)"]
        AramcoAcct["Aramco Personnel Account (New)"]
    end

    subgraph Bupa["BUPA Users"]
        PreAuth["PreAuth (New)"]
        MedTeam["Medical Team"]
        Admin["Admin"]
        MCUTeam["MCU Team"]
        CreateRef["CREATEREF"]
        AramcoKey["AramcoAccountKey"]
        AmendRef["AmendRef"]
    end

    subgraph System["Core Modules"]
        Appeals["Appeal Workflow"]
        MRO["MRO Workflow (Part 1 & 2)"]
        Discussion["Discussion List Module"]
        BadgeHist["Badge History"]
        AppealHist["Appeal Response History"]
        Notify["Notifications (In-app + Email)"]
    end

    Aramco --> System
    Bupa --> System
```

---

## 2. High-Level Appeal Workflow

```mermaid
flowchart LR
    A["New Appeal Created"] --> B["MSMD Section + Assignments"]
    B --> C["BUPA Arabia Section"]
    C --> D["MRO Workflow Part 1 & 2"]
    D --> E["MRO Generation by MSMD"]
    E --> F["Badge History"]
    E --> G["Appeal Response History"]
    B --> H["Discussion List Module"]
    A --> I["Notifications"]
    B --> I
    C --> I
    D --> I
    E --> I
```

---

## 3. Flow 1 — Appeal Lifecycle (End-to-End)

```mermaid
flowchart TD
    Start([Start]) --> S1

    S1["Step 1: Appeal Created<br/>By BUPA Key Account OR<br/>Aramco Personnel Key Account"]
    S1 --> S2{"Step 2: Edit / Cancel?"}
    S2 -->|Edit| S1
    S2 -->|Cancel| End([End])
    S2 -->|Proceed| S3

    S3["Step 3: MSMD Login View<br/>MSMD sees created appeals"]
    S3 --> S4["Step 4: MSMD Edit Mode<br/>Opens appeal in edit modal<br/>Completes MSMD section<br/>Assigns case to BUPA team"]

    S4 --> S5["Step 5: BUPA Team View<br/>Assigned case visible to BUPA users"]
    S5 --> S6["Step 6: BUPA Response<br/>BUPA Team submits response"]

    S6 --> Done([Appeal cycle complete])
```

---

## 4. Flow 1 — Appeal Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Creator as BUPA Key Account /<br/>Aramco Personnel Account
    participant System as Communication System
    participant MSMD as MSMD User
    participant Bupa as BUPA Team

    Creator->>System: Create new appeal
    System-->>Creator: Appeal saved

    opt Edit before assignment
        Creator->>System: Edit or cancel appeal
        System-->>Creator: Updated / cancelled
    end

    MSMD->>System: Login
    System-->>MSMD: Display created appeals

    MSMD->>System: Open appeal (edit modal)
    MSMD->>System: Complete MSMD section
    MSMD->>System: Assign case to BUPA team
    System-->>Bupa: Case appears in BUPA queue

    Bupa->>System: Open assigned case
    Bupa->>System: Submit BUPA response
    System-->>MSMD: Response recorded
    System-->>Creator: Status updated (notification)
```

---

## 5. Flow 2 — MRO Process (Overview)

```mermaid
flowchart LR
    A["Select MRO Category"] --> B["MRO Part 1<br/>(MSMD)"]
    B --> C["Assign to<br/>BUPA Team"]
    C --> D["MRO Part 2<br/>(BUPA Team)"]
    D --> E["Final MRO Generation<br/>(MSMD)"]
    E --> F["PDF Generated &<br/>Auto-Attached"]
```

---

## 6. Flow 2 — MRO Detailed Steps

```mermaid
flowchart TD
    Start([Appeal with MRO category]) --> S1

    S1["Step 1: Select MRO Category<br/>MRO button becomes visible"]
    S1 --> S2["Step 2: MRO Form Part 1<br/>Form prefilled from appeal data<br/>MSMD completes Part 1<br/>MSMD assigns to BUPA team"]

    S2 --> S3["Step 3: BUPA Team opens MRO case<br/>MRO button visible to BUPA"]
    S3 --> S4["Step 4: BUPA Team updates Part 2<br/>Completes Part 2 section"]

    S4 --> S5["Step 5: Generate MRO button<br/>visible to MSMD"]
    S5 --> S6["Step 6: MSMD enters recommendation<br/>Generates MRO PDF"]

    S6 --> S7["Step 7: Final MRO form<br/>automatically attached to case"]
    S7 --> End([MRO complete])
```

---

## 7. Flow 2 — MRO Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant MSMD as MSMD User
    participant System as Communication System
    participant Bupa as BUPA Team

    MSMD->>System: Select MRO category on appeal
    System-->>MSMD: Show MRO button

    MSMD->>System: Open MRO Form Part 1
    Note over System: Form prefilled from appeal
    MSMD->>System: Complete Part 1
    MSMD->>System: Assign to BUPA team
    System-->>Bupa: MRO case assigned

    Bupa->>System: Open MRO case
    System-->>Bupa: Show MRO button + Part 2
    Bupa->>System: Complete Part 2 section
    System-->>MSMD: Part 2 submitted

    MSMD->>System: Click Generate MRO Form
    MSMD->>System: Enter recommendation
    MSMD->>System: Generate PDF
    System->>System: Auto-attach MRO to appeal
    System-->>MSMD: MRO attached confirmation
    System-->>Bupa: Notification (optional)
```

---

## 8. Discussion List Module

```mermaid
flowchart TD
    A["MSMD sets discussion date<br/>on assigned case(s)"] --> B["On matching date,<br/>cases appear in Discussion List"]
    B --> C["MSMD selects multiple cases<br/>for bulk discussion"]
    C --> D["Discussion pop-up opens"]
    D --> E{"Navigate cases"}
    E -->|Next| D
    E -->|Previous| D
    E -->|Done| F([Discussion complete])
```

```mermaid
sequenceDiagram
    participant MSMD as MSMD User
    participant System as Communication System

    MSMD->>System: Set discussion date on case(s)
    System->>System: Schedule for Discussion List

    Note over System: On discussion date
    System-->>MSMD: Cases appear in Discussion List

    MSMD->>System: Select multiple cases (bulk)
    MSMD->>System: Open discussion pop-up
    loop Navigate cases
        MSMD->>System: Next / Previous
        System-->>MSMD: Show case details
    end
```

---

## 9. History & Audit Modules

```mermaid
flowchart LR
    subgraph User["Any Authorized User"]
        U1["View Badge Number History"]
        U2["View Appeal Response History"]
    end

    subgraph Data["System Records"]
        BH["Badge History<br/>(per badge number)"]
        ARH["Appeal Response History<br/>(per case)"]
    end

    U1 --> BH
    U2 --> ARH
```

---

## 10. Notification Flow

```mermaid
flowchart TD
    Events["System Events<br/>(Appeal created, assigned,<br/>response submitted, MRO generated,<br/>discussion scheduled)"]
    Events --> InApp["In-App Notification Icon"]
    Events --> Email["Email Notification"]

    InApp --> User["User sees alert in portal"]
    Email --> User
```

```mermaid
sequenceDiagram
    participant Actor as User (MSMD / BUPA / Creator)
    participant System as Communication System
    participant Notify as Notification Service
    participant Recipient as Target User

    Actor->>System: Trigger workflow action<br/>(assign, respond, generate MRO, etc.)
    System->>Notify: Publish event
    Notify->>Recipient: In-app notification (icon/badge)
    Notify->>Recipient: Email notification
    Recipient->>System: View notification / open case
```

---

## 11. Landing Page by Role

```mermaid
flowchart TD
    Login([User Login]) --> Role{User Role?}

    Role -->|MSMD User| LP1["MSMD Landing Page<br/>Appeals queue, assignments,<br/>MRO, Discussion List"]
    Role -->|Other Users| LP2["Other User Landing Page<br/>Role-specific views<br/>(BUPA, Aramco, Admin, etc.)"]

    LP1 --> Actions1["Create / review appeals<br/>Assign to BUPA<br/>Generate MRO<br/>Manage discussions"]
    LP2 --> Actions2["Create appeals<br/>Submit responses<br/>View history"]
```

---

## 12. Complete System Interaction (Master Sequence)

```mermaid
sequenceDiagram
    autonumber
    box Aramco
        participant Creator as Aramco / BUPA Creator
        participant MSMD as MSMD User
    end
    box BUPA
        participant Bupa as BUPA Team
    end
    participant Sys as System

    Creator->>Sys: Create appeal
    MSMD->>Sys: Review & assign to BUPA
    Bupa->>Sys: Submit response

    alt MRO required
        MSMD->>Sys: MRO Part 1 + assign
        Bupa->>Sys: MRO Part 2
        MSMD->>Sys: Generate & attach MRO PDF
    end

    opt Discussion scheduled
        MSMD->>Sys: Set date & bulk discuss
    end

    Sys->>Creator: Badge / response history updated
    Sys->>MSMD: Notifications
    Sys->>Bupa: Notifications
```

---

## Summary Mapping (Slides → Diagrams)

| Presentation section | Diagram(s) |
|----------------------|------------|
| Slides 2–3 (Roles & overview) | #1, #2, #11 |
| Slides 6–11 (Flow 1 — Appeal) | #3, #4 |
| Slides 12–19 (Flow 2 — MRO) | #5, #6, #7 |
| Slides 20–21 (Discussion) | #8 |
| Slides 22–24 (History) | #9 |
| Slides 25–26 (Notifications) | #10 |
| All flows combined | #12 |

**Source:** `docs/MS&AMD_Module_Flow_Presentation.pptx`
