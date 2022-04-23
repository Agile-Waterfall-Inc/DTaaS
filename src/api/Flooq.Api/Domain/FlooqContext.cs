using Flooq.Api.Models;
using Microsoft.EntityFrameworkCore;
using Version = Flooq.Api.Models.Version;

namespace Flooq.Api.Domain
{
  #pragma warning disable CS1591
  public class FlooqContext : DbContext
  {
    public FlooqContext(DbContextOptions<FlooqContext> options) : base(options)
    { }
    public DbSet<DataFlow> DataFlows => Set<DataFlow>();
    public DbSet<Version> Versions => Set<Version>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<DataFlow>()
        .Property(flow => flow.Id)
        .ValueGeneratedOnAdd();

      modelBuilder.Entity<DataFlow>()
        .Property(flow => flow.Status)
        .HasDefaultValue("Disabled");
    }
  }
  #pragma warning restore CS1591
}