﻿using System;
using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

namespace ASC.Core.Common.EF.Model
{
    [Table("webstudio_settings")]
    public class DbWebstudioSettings : BaseEntity
    {
        public int TenantId { get; set; }
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Data { get; set; }

        public override object[] GetKeys()
        {
            return new object[] { TenantId, Id, UserId };
        }
    }

    public static class WebstudioSettingsExtension
    {
        public static ModelBuilderWrapper AddWebstudioSettings(this ModelBuilderWrapper modelBuilder)
        {
            _ = modelBuilder
                .Add(MySqlAddWebstudioSettings, Provider.MySql)
                .Add(PgSqlAddWebstudioSettings, Provider.Postgre)
                .HasData(
                new DbWebstudioSettings { TenantId = 1, Id = Guid.Parse("9a925891-1f92-4ed7-b277-d6f649739f06"), UserId = Guid.Parse("00000000-0000-0000-0000-000000000000"), Data = "{'Analytics':true,'Completed':true}" },
                new DbWebstudioSettings { TenantId = 1, Id = Guid.Parse("ab5b3c97-a972-475c-bb13-71936186c4e6"), UserId = Guid.Parse("00000000-0000-0000-0000-000000000000"), Data = "{'ColorThemeName':'pure - orange','FirstRequest':false}" }
                );
            return modelBuilder;
        }

        public static void MySqlAddWebstudioSettings(this ModelBuilder modelBuilder)
        {
            _ = modelBuilder.Entity<DbWebstudioSettings>(entity =>
            {
                _ = entity.HasKey(e => new { e.TenantId, e.Id, e.UserId })
                    .HasName("PRIMARY");

                _ = entity.ToTable("webstudio_settings");

                _ = entity.HasIndex(e => e.Id)
                    .HasName("ID");

                _ = entity.Property(e => e.TenantId).HasColumnName("TenantID");

                _ = entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                _ = entity.Property(e => e.UserId)
                    .HasColumnName("UserID")
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                _ = entity.Property(e => e.Data)
                    .IsRequired()
                    .HasColumnType("mediumtext")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
            });
        }
        public static void PgSqlAddWebstudioSettings(this ModelBuilder modelBuilder)
        {
            _ = modelBuilder.Entity<DbWebstudioSettings>(entity =>
            {
                _ = entity.HasKey(e => new { e.TenantId, e.Id, e.UserId })
                    .HasName("webstudio_settings_pkey");

                _ = entity.ToTable("webstudio_settings", "onlyoffice");

                _ = entity.HasIndex(e => e.Id)
                    .HasName("ID");

                _ = entity.Property(e => e.TenantId).HasColumnName("TenantID");

                _ = entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasMaxLength(64);

                _ = entity.Property(e => e.UserId)
                    .HasColumnName("UserID")
                    .HasMaxLength(64);

                _ = entity.Property(e => e.Data).IsRequired();
            });
        }
    }
}
