using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Flooq.Api.Services;

public interface IUserService
{
  Task<ActionResult<IdentityUser>> GetUserById(string? id);
  
  Task<ActionResult<IdentityUser>> GetUserByEmail(string? email);
  
  Task<int> SaveChangesAsync();
  
  public EntityEntry<IdentityUser> AddUser(IdentityUser user);

  public EntityEntry<IdentityUser> RemoveUser(IdentityUser user);

  public bool UserExists(string? id);
}