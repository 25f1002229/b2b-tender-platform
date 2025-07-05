import { useState } from "react";

export default function ApplicationForm({ tenderId, companyId }: { tenderId: number; companyId: number }) {
  const [proposalText, setProposalText] = useState("");
  const [bidAmount, setBidAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenders/${tenderId}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, proposalText, bidAmount }),
    });
    alert("Proposal submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={proposalText} onChange={e => setProposalText(e.target.value)} placeholder="Proposal..." />
      <input type="number" value={bidAmount} onChange={e => setBidAmount(Number(e.target.value))} />
      <button type="submit">Submit Proposal</button>
    </form>
  );
}
