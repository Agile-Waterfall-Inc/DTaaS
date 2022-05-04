﻿// <auto-generated />
using System;
using Flooq.Api.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    [DbContext(typeof(FlooqContext))]
    [Migration("20220503113427_RemoveIdentityDbContext")]
    partial class RemoveIdentityDbContext
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Flooq.Api.Models.DataFlow", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Definition")
                        .HasColumnType("text");

                    b.Property<DateTime?>("LastEdited")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("text")
                        .HasDefaultValue("Disabled");

                    b.HasKey("Id");

                    b.ToTable("DataFlows");
                });

            modelBuilder.Entity("Flooq.Api.Models.LinearizedGraph", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Graph")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Graphs");
                });

            modelBuilder.Entity("Flooq.Api.Models.Version", b =>
                {
                    b.Property<string>("Tag")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Notes")
                        .HasColumnType("text");

                    b.HasKey("Tag");

                    b.ToTable("Versions");
                });
#pragma warning restore 612, 618
        }
    }
}