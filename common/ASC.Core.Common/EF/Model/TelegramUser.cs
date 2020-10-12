﻿using System;
using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

namespace ASC.Core.Common.EF.Model
{
    [Table("telegram_users")]
    public class TelegramUser : BaseEntity
    {
        [Column("portal_user_id")]
        public Guid PortalUserId { get; set; }

        [Column("tenant_id")]
        public int TenantId { get; set; }

        [Column("telegram_user_id")]
        public int TelegramUserId { get; set; }

        public override object[] GetKeys()
        {
            return new object[] { TenantId, PortalUserId };
        }
    }

    public static class TelegramUsersExtension
    {
        public static ModelBuilderWrapper AddTelegramUsers(this ModelBuilderWrapper modelBuilder)
        {
            _ = modelBuilder
                .Add(MySqlAddTelegramUsers, Provider.MySql)
                .Add(PgSqlAddTelegramUsers, Provider.Postgre);
            return modelBuilder;
        }
        public static void MySqlAddTelegramUsers(this ModelBuilder modelBuilder)
        {
            _ = modelBuilder.Entity<TelegramUser>(entity =>
            {
                _ = entity.HasKey(e => new { e.TenantId, e.PortalUserId })
                    .HasName("PRIMARY");

                _ = entity.ToTable("telegram_users");

                _ = entity.HasIndex(e => e.TelegramUserId)
                    .HasName("tgId");

                _ = entity.Property(e => e.TenantId).HasColumnName("tenant_id");

                _ = entity.Property(e => e.PortalUserId)
                    .HasColumnName("portal_user_id")
                    .HasColumnType("varchar(38)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                _ = entity.Property(e => e.TelegramUserId).HasColumnName("telegram_user_id");
            });
        }
        public static void PgSqlAddTelegramUsers(this ModelBuilder modelBuilder)
        {
            _ = modelBuilder.Entity<TelegramUser>(entity =>
            {
                _ = entity.HasKey(e => new { e.TenantId, e.PortalUserId })
                    .HasName("telegram_users_pkey");

                _ = entity.ToTable("telegram_users", "onlyoffice");

                _ = entity.HasIndex(e => e.TelegramUserId)
                    .HasName("tgId");

                _ = entity.Property(e => e.TenantId).HasColumnName("tenant_id");

                _ = entity.Property(e => e.PortalUserId)
                    .HasColumnName("portal_user_id")
                    .HasMaxLength(38);

                _ = entity.Property(e => e.TelegramUserId).HasColumnName("telegram_user_id");
            });
        }
    }
}
