﻿using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace ASC.Core.Common.EF.Model
{
    [Table("webstudio_settings")]
    public class DbWebstudioSettings
    {
        public int TenantId { get; set; }
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public JsonDocument Data { get; set; }
    }

    public static class WebstudioSettingsExtension
    {
        public static void AddWebstudioSettings(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DbWebstudioSettings>()
                .HasKey(c => new { c.TenantId, c.Id, c.UserId });

            modelBuilder.Entity<DbWebstudioSettings>()
                .Property(r => r.Data)
                .HasConversion(r => r.ToString(), r => JsonDocument.Parse(r, new JsonDocumentOptions()));
        }
    }
}
