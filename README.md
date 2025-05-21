# Rsof-Sadef
---

## Branch Guide
Follow these steps for branch management:

1. **Create a new branch from `stable`.**

2. **Branch Naming Convention**:  
   Use the format: `[Task Type]/[Task Id]-[Task Name]`.  
   Example: `bugfix/001-create-api`.

3. **Pull Requests**:  
   Create pull requests against the `develop` branch.

4. **Documentation**:  
   Create a flow diagram or sequence diagram for each ticket.

---

## Database Migration

To create a new database migration, execute the following commands in sequence:

Run the following command to add a migration:

1. dotnet ef migrations add initial --project ./Sadef.InfraStructure --startup-project ./Sadef.API

2. dotnet ef database update --project ./Sadef.InfraStructure --startup-project ./Sadef.API


