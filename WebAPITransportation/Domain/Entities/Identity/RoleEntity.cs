using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity;

public class RoleEntity : IdentityRole<int>
{
    public RoleEntity() { }

    public RoleEntity(string name) { this.Name = name; }
    
    public ICollection<UserRoleEntity> UserRoles { get; set; } = new List<UserRoleEntity>();
}