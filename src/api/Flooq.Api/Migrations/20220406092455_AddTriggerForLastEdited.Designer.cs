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
    [Migration("20220406092455_AddTriggerForLastEdited")]
    partial class AddTriggerForLastEdited
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.3")
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
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("DataFlows");

                    b.HasData(
                        new
                        {
                            Id = new Guid("0af5bc45-881f-4a40-aa4c-b07e6dbd971a"),
                            Definition = "{\r\n  \"nodes\": [\r\n    {\r\n      \"id\": \"1\",\r\n      \"dragHandle\": \".custom-drag-handle\",\r\n      \"type\": \"httpIn\",\r\n      \"data\": {\r\n        \"title\": \"Http Input\",\r\n        \"input\": {\r\n          \"url\": \"https://executor.dataflow.ch/IJF9K2\",\r\n          \"method\": \"post\",\r\n          \"contentType\": \"application/json\",\r\n          \"sampleBody\": \"{}\"\r\n        },\r\n        \"incomingHandles\": [],\r\n        \"outgoingHandles\": [\r\n          {\r\n            \"id\": \"11\",\r\n            \"name\": \"a\"\r\n          }\r\n        ]\r\n      },\r\n      \"position\": {\r\n        \"x\": 0,\r\n        \"y\": 0\r\n      }\r\n    },\r\n    {\r\n      \"id\": \"2\",\r\n      \"dragHandle\": \".custom-drag-handle\",\r\n      \"type\": \"filter\",\r\n      \"data\": {\r\n        \"title\": \"Filter\",\r\n        \"filter\": {\r\n          \"field\": \"tags\",\r\n          \"value\": \"secret\",\r\n          \"condition\": \"ne\"\r\n        },\r\n        \"incomingHandles\": [\r\n          {\r\n            \"id\": \"21\",\r\n            \"name\": \"a\"\r\n          }\r\n        ],\r\n        \"outgoingHandles\": [\r\n          {\r\n            \"id\": \"21\",\r\n            \"name\": \"a\"\r\n          }\r\n        ]\r\n      },\r\n      \"position\": {\r\n        \"x\": 400,\r\n        \"y\": 100\r\n      }\r\n    },\r\n    {\r\n      \"id\": \"3\",\r\n      \"dragHandle\": \".custom-drag-handle\",\r\n      \"type\": \"httpOut\",\r\n      \"data\": {\r\n        \"title\": \"Http Output\",\r\n        \"output\": {\r\n          \"url\": \"\",\r\n          \"method\": \"post\",\r\n          \"contentType\": \"application/json\",\r\n          \"sampleBody\": \"{}\"\r\n        },\r\n        \"incomingHandles\": [\r\n          {\r\n            \"id\": \"3a\",\r\n            \"name\": \"a\"\r\n          }\r\n        ],\r\n        \"outgoingHandles\": []\r\n      },\r\n      \"position\": {\r\n        \"x\": 800,\r\n        \"y\": 0\r\n      }\r\n    }\r\n  ],\r\n  \"edges\": [\r\n    {\r\n      \"id\": \"e1-2\",\r\n      \"fromNode\": \"1\",\r\n      \"fromHandle\": \"11\",\r\n      \"toNode\": \"2\",\r\n      \"toHandle\": \"2a\"\r\n    },\r\n    {\r\n      \"id\": \"e2-3\",\r\n      \"fromNode\": \"2\",\r\n      \"fromHandle\": \"21\",\r\n      \"toNode\": \"3\",\r\n      \"toHandle\": \"3a\"\r\n    }\r\n  ]\r\n}",
                            LastEdited = new DateTime(2022, 3, 5, 13, 45, 12, 0, DateTimeKind.Utc),
                            Name = "Demo Flow #1",
                            Status = "Active"
                        });
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
