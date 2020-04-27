﻿using System;
using System.ComponentModel.DataAnnotations.Schema;

using ASC.ElasticSearch;

using Nest;

using ColumnAttribute = System.ComponentModel.DataAnnotations.Schema.ColumnAttribute;

namespace ASC.Files.Core.EF
{
    [ElasticsearchType(RelationName = Tables.Folder)]
    [Table("files_folder")]
    public class DbFolder : IDbFile, IDbSearch, ISearchItem
    {
        public int Id { get; set; }

        [Column("parent_id")]
        public int ParentId { get; set; }

        public string Title { get; set; }

        [Column("folder_type")]
        public FolderType FolderType { get; set; }

        [Column("create_by")]
        public Guid CreateBy { get; set; }

        [Column("create_on")]
        public DateTime CreateOn { get; set; }

        [Column("modified_by")]
        public Guid ModifiedBy { get; set; }

        [Column("modified_on")]
        public DateTime ModifiedOn { get; set; }

        [Column("tenant_id")]
        public int TenantId { get; set; }
        public int FoldersCount { get; set; }
        public int FilesCount { get; set; }

        [NotMapped]
        public string IndexName
        {
            get => Tables.Folder;
        }
    }
}
