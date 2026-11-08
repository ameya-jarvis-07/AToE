import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Cafe } from "../../data/seed";

type CafeCardProps = {
  cafe: Cafe;
  index?: number;
};

export function CafeCard({ cafe, index = 0 }: CafeCardProps) {
  return (
    <motion.article
      className="cafe-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link to={`/cafe/${cafe.slug}`} className="cafe-image" aria-label={`Read about ${cafe.name}`}>
        <span className="image-stamp">ATOE / FIELD NOTE</span>
        <span className="image-number">0{index + 1}</span>
        <ArrowUpRight size={20} />
      </Link>
      <div className="card-meta">
        <span>{cafe.city ?? "Location to be confirmed"}</span>
        {cafe.pick && <span>{cafe.pick === "sv" ? "SV'S PICK" : "EDITOR'S PICK"}</span>}
      </div>
      <h3><Link to={`/cafe/${cafe.slug}`}>{cafe.name}</Link></h3>
      <p>{cafe.description}</p>
      <div className="tags">
        {cafe.ambienceTags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </motion.article>
  );
}
