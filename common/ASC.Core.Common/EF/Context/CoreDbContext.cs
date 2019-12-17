﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ASC.Core.Common.EF
{
    public class CoreDbContext : BaseDbContext
    {
        public DbSet<DbTariff> Tariffs { get; set; }
        public DbSet<DbButton> Buttons { get; set; }
        public DbSet<Acl> Acl { get; set; }
        public DbSet<DbQuota> Quotas { get; set; }
        public DbSet<DbQuotaRow> QuotaRows { get; set; }

        public CoreDbContext() { }
        public CoreDbContext(DbContextOptions<CoreDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.AddAcl();

            modelBuilder.Entity<DbButton>()
                .HasKey(c => new { c.TariffId, c.PartnerId });

            modelBuilder.Entity<DbQuotaRow>()
                .HasKey(c => new { c.Tenant, c.Path });
        }
    }

    public static class CoreDbExtension
    {
        public static IServiceCollection AddCoreDbContextService(this IServiceCollection services)
        {
            return services.AddDbContextManagerService<CoreDbContext>();
        }
    }
}
