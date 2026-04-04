export const dynamic = "force-dynamic";

import { getReleaseNotes } from "@/lib/actions";
import { ReleaseList } from "@/features/release/release-list";

export default async function ReleasesPage() {
  const releases = await getReleaseNotes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">リリースノート</h1>
      </div>
      <ReleaseList releases={releases} />
    </div>
  );
}
