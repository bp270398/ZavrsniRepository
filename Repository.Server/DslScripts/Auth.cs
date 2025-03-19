using Rhetos.Dom.DefaultConcepts;
using Rhetos.Utilities;

namespace Common.Repositories
{
    public partial class GetUserContext_Repository
    {
        private UserContext GetUserContextFn(GetUserContext parameter, DomRepository repository, IUserInfo userInfo)
        {
            if (!userInfo.IsUserRecognized) return new UserContext();

            Guid principalId = Guid.Empty;
            string email = "";

            _executionContext.SqlExecuter.ExecuteReaderRaw($"SELECT ID, Email FROM Common.Principal WHERE Name = '{userInfo.UserName}'", null,
                reader =>
                {
                    principalId = reader.IsDBNull(0) ? Guid.Empty : reader.GetGuid(0);
                    email = reader.IsDBNull(1) ? "" : reader.GetString(1);
                });

            if (principalId == Guid.Empty) return new UserContext();

            string firstName = "";
            string lastName = "";

            _executionContext.SqlExecuter.ExecuteReaderRaw($"SELECT FirstName, LastName FROM Models.Professor WHERE ID = '{principalId}'", null,
            reader =>
            {
                firstName = reader.IsDBNull(0) ? "" : reader.GetString(0);
                lastName = reader.IsDBNull(1) ? "" : reader.GetString(1);
            });

            return new UserContext
            {
                PrincipalID = principalId,
                PrincipalName = userInfo.UserName,
                FirstName = firstName,
                LastName = lastName,
                Email = email,
            };
        }
    }

    public partial class UpsertPrincipal_Repository
    {

        void UpsertPrincipal(UpsertPrincipal parameter, DomRepository repository, IUserInfo userInfo)
        {
            if (parameter.Principal == null) return;

            var existingPrincipal = repository.Common.Principal.Query().Where(x => x.ID == parameter.Principal.ID).FirstOrDefault();

            if (existingPrincipal == null)
            {
                if (parameter.Principal.ID == null) parameter.Principal.ID = Guid.NewGuid();
                parameter.Principal.Name = parameter.Principal.Name.Trim();
                repository.Common.Principal.Insert(parameter.Principal);

                var userId = repository.Common.Principal.Query().Where(x => x.ID == parameter.Principal.ID).Select(x => x.AspNetUserId).FirstOrDefault();

                _executionContext.SqlExecuter.ExecuteSqlInterpolated($"INSERT INTO dbo.webpages_Membership(UserId, PasswordFailuresSinceLastSuccess, Password, PasswordSalt) VALUES ({userId}, 0, {Guid.NewGuid()}, '')");
            }
            else
            {
                var changed = existingPrincipal.Name != parameter.Principal.Name || existingPrincipal.Email != parameter.Principal.Email;

                if (changed)
                {
                    if (existingPrincipal.Name != parameter.Principal.Name)
                    {
                        var baseName = !string.IsNullOrWhiteSpace(parameter.Principal.Name) ? parameter.Principal.Name : existingPrincipal.Extension_Models_Professor != null ? existingPrincipal.Extension_Models_Professor.FirstName + existingPrincipal.Extension_Models_Professor.LastName : Guid.NewGuid().ToString();
                        var name = baseName;
                        var i = 1;

                        while (repository.Common.Principal.Query().Where(x => x.Name == name).Any())
                        {
                            name = baseName + i;
                            i++;
                        }

                        existingPrincipal.Name = name;
                    }
                    existingPrincipal.Email = parameter.Principal.Email;

                    repository.Common.Principal.Update(existingPrincipal.ToSimple());
                }
            }

            if (parameter.PrincipalHasRoles != null)
            {
                var existingPhr = repository.Common.PrincipalHasRole.Query().Where(x => x.PrincipalID == parameter.Principal.ID).ToSimple().ToList();
                var modelPhr = parameter.PrincipalHasRoles;

                var newPhrs = modelPhr.Where(modelRole => !existingPhr.Any(existingRole => existingRole.RoleID == modelRole.RoleID)).ToList();

                foreach (var newPhr in newPhrs)
                {
                    newPhr.PrincipalID = parameter.Principal.ID;
                    repository.Common.PrincipalHasRole.Insert(newPhr);
                }

                var obsoletePhrs = existingPhr.Where(existingRole => !modelPhr.Any(modelRole => modelRole.RoleID == existingRole.RoleID)).ToList();

                foreach (var obsoletePhr in obsoletePhrs)
                {
                    repository.Common.PrincipalHasRole.Delete(obsoletePhr);
                }
            }

        }
    }
    public partial class LockUser_Repository
    {
        void LockUser(LockUser parameter, DomRepository repository, IUserInfo userInfo)
        {
            if (parameter.PrincipalID == null) throw new Rhetos.UserException("Parametar PrincipalID je obavezan parametar.");

            var userId = repository.Common.Principal.Query().Where(x => x.ID == parameter.PrincipalID).Select(x => x.AspNetUserId).FirstOrDefault();

            if (userId != null)
            {
                _executionContext.SqlExecuter.ExecuteSqlInterpolated($"UPDATE  dbo.webpages_Membership SET LockoutEnd = Common.MaxDateTime() WHERE UserId = {userId}");
            }
            else
                throw new Rhetos.UserException($"Ne postoji Common.Principal s ID-em {parameter.PrincipalID}.");
        }
    }

    public partial class UnlockUser_Repository
    {
        void UnlockUser(UnlockUser parameter, DomRepository repository, IUserInfo userInfo)
        {
            if (parameter.PrincipalID == null) throw new Rhetos.UserException("Parametar PrincipalID je obavezan parametar.");

            var userId = repository.Common.Principal.Query().Where(x => x.ID == parameter.PrincipalID).Select(x => x.AspNetUserId).FirstOrDefault();

            if (userId != null)
            {
                _executionContext.SqlExecuter.ExecuteSqlInterpolated($"UPDATE  dbo.webpages_Membership SET LockoutEnd = NULL WHERE UserId = {userId}");
            }
            else
                throw new Rhetos.UserException($"Ne postoji Common.Principal s ID-em {parameter.PrincipalID}.");
        }
    }
}
