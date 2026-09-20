import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { useState } from "react";

interface FeedItemProps {
  initials: string;
  badgeLabel: string;
  author: string;
  role: string;
  date: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
  reposts: number;
  tags: string[];
}

export default function FeedItemCard({
  initials,
  badgeLabel,
  author,
  role,
  date,
  title,
  body,
  likes,
  comments,
  reposts,
  tags,
}: FeedItemProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <article
      className="py-6"
      style={{ borderBottom: "1px solid #DDE2DE" }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 mt-0.5"
          style={{
            width: 34,
            height: 34,
            background: "#DCEBE4",
            color: "#173F35",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-semibold rounded-sm px-1.5 py-0.5"
              style={{
                background: "#F7F6F1",
                color: "#173F35",
                letterSpacing: "0.06em",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              {badgeLabel}
            </span>
            <span className="text-sm font-semibold" style={{ color: "#17201D" }}>
              {author}
            </span>
            <span className="text-xs" style={{ color: "#66716C" }}>
              {role}
            </span>
            <span className="text-xs ml-auto flex-shrink-0" style={{ color: "#66716C" }}>
              {date}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pl-[46px]">
        <h4
          className="font-semibold mb-1 leading-snug"
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            color: "#17201D",
            fontSize: 15,
          }}
        >
          {title}
        </h4>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#66716C" }}>
          {body}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-sm cursor-pointer transition-colors"
              style={{
                background: "#F7F6F1",
                color: "#173F35",
                border: "1px solid #DDE2DE",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: liked ? "#173F35" : "#66716C", fontFamily: "'Manrope', sans-serif" }}
          >
            <Heart size={15} fill={liked ? "#173F35" : "none"} strokeWidth={1.5} />
            {likes + (liked ? 1 : 0)}
          </button>
          <button
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "#66716C" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#17201D")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#66716C")}
          >
            <MessageCircle size={15} strokeWidth={1.5} />
            {comments}
          </button>
          <button
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "#66716C" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#17201D")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#66716C")}
          >
            <Repeat2 size={15} strokeWidth={1.5} />
            {reposts}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className="flex items-center gap-1.5 text-xs transition-colors ml-auto"
            style={{ color: saved ? "#173F35" : "#66716C" }}
          >
            <Bookmark size={15} fill={saved ? "#173F35" : "none"} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
