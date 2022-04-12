using System;
using System.Linq;
using Flooq.Api.Domain;
using Flooq.Api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Version = Flooq.Api.Models.Version;

namespace Flooq.IntegrationTest;

public class FlooqWebApplicationFactory<Program> : WebApplicationFactory<Program> where Program: class
{
  public static readonly Guid TEST_GUID = Guid.NewGuid();
  public static readonly string TEST_VERSION = "0.0.1";
  
  protected override void ConfigureWebHost(IWebHostBuilder builder)
  {
    builder.ConfigureServices(services =>
    {
      var descriptor = services.SingleOrDefault(
        d => d.ServiceType == typeof(DbContextOptions<FlooqContext>));

      services.Remove(descriptor);

      services.AddDbContext<FlooqContext>(options =>
      {
        options.UseInMemoryDatabase("FlooqContext");
      });

      var sp = services.BuildServiceProvider();
      
      using (var scope = sp.CreateScope())
      {
        var scopedServices = scope.ServiceProvider;
        var db = scopedServices.GetRequiredService<FlooqContext>();
        db.Database.EnsureCreated();

        db.Versions.Add(new Version() {Name = "TestVersion", Notes = "IntegrationTest", Tag = TEST_VERSION});
        db.DataFlows.Add(new DataFlow()
        {
          Id = TEST_GUID,
          Name = "Demo Flow",
          Status = "Active",
          LastEdited = DateTime.Now,
          Definition = "{}"
        });
        
        db.SaveChanges();
      }
    });
  }
}