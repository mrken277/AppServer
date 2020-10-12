﻿using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

namespace ASC.Core.Common.EF.Model.Resource
{
    [Table("res_authorsfile")]
    public class ResAuthorsFile
    {
        public string AuthorLogin { get; set; }
        public int FileId { get; set; }
        public bool WriteAccess { get; set; }
    }

    public static class ResAuthorsFileExtension
    {
        public static ModelBuilderWrapper AddResAuthorsFile(this ModelBuilderWrapper modelBuilder)
        {
            _ = modelBuilder
                .Add(MySqlAddResAuthorsFile, Provider.MySql)
                .Add(PgSqlAddResAuthorsFile, Provider.Postgre);
            return modelBuilder;
        }
        public static void MySqlAddResAuthorsFile(this ModelBuilder modelBuilder)
        {
            _ = modelBuilder.Entity<ResAuthorsFile>(entity =>
            {
                _ = entity.HasKey(e => new { e.AuthorLogin, e.FileId })
                    .HasName("PRIMARY");

                _ = entity.ToTable("res_authorsfile");

                _ = entity.HasIndex(e => e.FileId)
                    .HasName("res_authorsfile_FK2");

                _ = entity.Property(e => e.AuthorLogin)
                    .HasColumnName("authorLogin")
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                _ = entity.Property(e => e.FileId).HasColumnName("fileid");

                _ = entity.Property(e => e.WriteAccess).HasColumnName("writeAccess");
            });
        }
        public static void PgSqlAddResAuthorsFile(this ModelBuilder modelBuilder)
        {
            _ = modelBuilder.Entity<ResAuthorsFile>(entity =>
            {
                _ = entity.HasKey(e => new { e.AuthorLogin, e.FileId })
                    .HasName("res_authorsfile_pkey");

                _ = entity.ToTable("res_authorsfile", "onlyoffice");

                _ = entity.HasIndex(e => e.FileId)
                    .HasName("res_authorsfile_FK2");

                _ = entity.Property(e => e.AuthorLogin)
                    .HasColumnName("authorLogin")
                    .HasMaxLength(50);

                _ = entity.Property(e => e.FileId).HasColumnName("fileid");

                _ = entity.Property(e => e.WriteAccess).HasColumnName("writeAccess");
            });
        }
    }
}
