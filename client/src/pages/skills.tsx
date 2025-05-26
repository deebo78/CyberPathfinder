import { useState } from "react";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useNiceFramework } from "@/hooks/use-nice-framework";

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");
  const { skills, isLoadingSkills } = useNiceFramework();

  const filteredSkills = skills?.filter(skill =>
    skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const columns = [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-2xl">
          {row.getValue("description")}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="/" className="text-gray-700 hover:text-primary">
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-primary font-medium">Skills</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills</h2>
          <p className="text-gray-600">Manage NICE Framework skill statements</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoadingSkills ? "Loading..." : `${filteredSkills.length} Skills`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredSkills}
            isLoading={isLoadingSkills}
          />
        </CardContent>
      </Card>
    </div>
  );
}
