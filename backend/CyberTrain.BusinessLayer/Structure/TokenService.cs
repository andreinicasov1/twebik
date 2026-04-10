using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CyberTrain.Domain.Entities.User;
using Microsoft.IdentityModel.Tokens;

namespace CyberTrain.BusinessLayer.Structure
{
    public class TokenService
    {
        public static string JwtKey { get; set; } = "super-secret-dev-key-change-in-prod-please-0123456789";
        public static string JwtIssuer { get; set; } = "CyberTrain";
        public static string JwtAudience { get; set; } = "CyberTrainFrontend";

        public TokenService() { }

        public string GenerateToken(UserData user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role == UserRole.Admin ? "admin" : "user")
            };

            var token = new JwtSecurityToken(
                issuer: JwtIssuer,
                audience: JwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
