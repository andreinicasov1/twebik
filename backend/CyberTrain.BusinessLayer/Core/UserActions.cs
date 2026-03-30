using CyberTrain.BusinessLayer.Structure;
using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Entities.User;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Core
{
    public class UserActions
    {
        public UserActions() { }

        internal ActionResponce UserLoginDataValidationExecution(UserLoginDto udata)
        {
            UserData? user;
            using (var db = new UserContext())
            {
                user = db.Users.FirstOrDefault(x => x.Email == udata.Email && !x.IsDeleted);
            }

            if (user == null)
            {
                return new ActionResponce { IsSuccess = false, Message = "Email sau parolă incorecte." };
            }

            var isValid = BCrypt.Net.BCrypt.Verify(udata.Password, user.Password);
            if (!isValid)
            {
                return new ActionResponce { IsSuccess = false, Message = "Email sau parolă incorecte." };
            }

            var token = new TokenService().GenerateToken(user);

            string? clanName = null;
            if (user.ClanId.HasValue)
            {
                using var cdb = new ClanContext();
                clanName = cdb.Clans.FirstOrDefault(c => c.Id == user.ClanId.Value)?.Name;
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Autentificare reușită.",
                Data = new AuthResponseDto
                {
                    Token = token,
                    User = UserMapper.ToDto(user, clanName)
                }
            };
        }

        internal ActionResponce UserRegDataValidationAction(UserRegisterDto uReg)
        {
            using (var db = new UserContext())
            {
                if (db.Users.Any(x => x.Email == uReg.Email && !x.IsDeleted))
                {
                    return new ActionResponce { IsSuccess = false, Message = "Email deja folosit." };
                }
                if (db.Users.Any(x => x.UserName == uReg.Username && !x.IsDeleted))
                {
                    return new ActionResponce { IsSuccess = false, Message = "Nume utilizator deja folosit." };
                }
            }

            var user = new UserData
            {
                UserName = uReg.Username.Trim(),
                Email = uReg.Email.Trim().ToLower(),
                Password = BCrypt.Net.BCrypt.HashPassword(uReg.Password),
                Role = UserRole.User,
                Xp = 0,
                RegisteredOn = DateTime.UtcNow
            };

            using (var db = new UserContext())
            {
                db.Users.Add(user);
                db.SaveChanges();
            }

            // Login automat imediat după înregistrare (fără confirmare email)
            var token = new TokenService().GenerateToken(user);

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Cont creat cu succes.",
                Data = new AuthResponseDto
                {
                    Token = token,
                    User = UserMapper.ToDto(user)
                }
            };
        }

        internal UserDto? GetUserByIdExecution(int id)
        {
            UserData? user;
            using (var db = new UserContext())
            {
                user = db.Users.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            }
            if (user == null) return null;

            string? clanName = null;
            if (user.ClanId.HasValue)
            {
                using var cdb = new ClanContext();
                clanName = cdb.Clans.FirstOrDefault(c => c.Id == user.ClanId.Value)?.Name;
            }
            return UserMapper.ToDto(user, clanName);
        }
    }
}
