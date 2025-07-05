import { useEffect, useState } from "react";
import axios from "axios";

export default function TenderList() {
  const [tenders, setTenders] = useState([]);
  useEffect(() => {
    axios.get("${process.env.NEXT_PUBLIC_API_BASE_URL}/tenders")
      .then(res => setTenders(res.data.tenders))
      .catch(err => console.error(err));
  }, []);
  return (
    <div>
      <h2>Tenders</h2>
      <ul>
        {tenders.map((t: any) => (
          <li key={t.id}>{t.title} - {t.description}</li>
        ))}
      </ul>
    </div>
  );
}
