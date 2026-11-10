import React, { useState } from 'react';
import {
  Heart,
  Share2,
  MessageCircle,
  ExternalLink,
  Instagram,
  Facebook,
  CheckCircle2,
  Calendar,
  MapPin,
  Flame,
  Bookmark,
  Send,
} from 'lucide-react';

export interface SocialPost {
  id: string;
  category: 'eventos' | 'bastidores' | 'tradicao';
  author: string;
  handle: string;
  timeAgo: string;
  location: string;
  title: string;
  caption: string;
  image: string;
  initialLikes: number;
  commentsCount: number;
  tags: string[];
}

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    category: 'eventos',
    author: 'Rádio de Pátria e Querência',
    handle: '@radiodepatriaequerencia',
    timeAgo: 'Há 2 horas',
    location: 'Parobé / RS',
    title: 'Cobertura Especial: Festival Nativista & Noite dos Galpões',
    caption:
      'Buenas gauchada! A equipe da Rádio de Pátria e Querência já está com os microfones a postos para a grande noite dos festivais! Muita gaita, violão de ponta de bota e aquele verso que emociona quem ama o Rio Grande. Fique ligado na nossa sintonia ao vivo!',
    image: '/src/assets/images/festival_event_1794314283801.jpg',
    initialLikes: 284,
    commentsCount: 38,
    tags: ['#MusicaGaucha', '#FestivalNativista', '#PatriaEQuerencia', '#ParobeRS'],
  },
  {
    id: 'post-2',
    category: 'tradicao',
    author: 'Rádio de Pátria e Querência',
    handle: '@radiodepatriaequerencia',
    timeAgo: 'Ontem às 18:30',
    location: 'Galpão Crioulo Querência Amada',
    title: 'Mateada de Galpão & Costela no Fogo de Chão',
    caption:
      'Domingo de sol, água quente na chaleira e chimarrão cevado de primeira. É nos galpões que a nossa identidade se fortalece e a prosa boa não tem hora para acabar. Um abraço a todos os ouvintes do Brasil e do mundo que acompanham nossa programação campeira!',
    image: '/src/assets/images/rodeio_galpao_1794314284479.jpg',
    initialLikes: 412,
    commentsCount: 56,
    tags: ['#Chimarrao', '#TradicaoGaucha', '#FogoDeChao', '#VidaCampeira'],
  },
  {
    id: 'post-3',
    category: 'bastidores',
    author: 'Rádio de Pátria e Querência',
    handle: '@radiodepatriaequerencia',
    timeAgo: 'Há 2 dias',
    location: 'Estúdios Parobé / RS',
    title: 'Pôr do Sol no Pampa: A Poesia que Inspira Nossa Programação',
    caption:
      'O entardecer nos campos do Sul é a maior inspiração para a seleção musical que entra no ar todas as noites no programa Ronda da Tradição. Obrigado pelo carinho de cada família que nos sintoniza pelo aplicativo e pelo site!',
    image: '/src/assets/images/pampa_hero_1794309168243.jpg',
    initialLikes: 350,
    commentsCount: 29,
    tags: ['#PampaGaucho', '#RondaDaTradicao', '#MusicaCampeira', '#RioGrandeDoSul'],
  },
];

export const SocialNewsFeed: React.FC = () => {
  const [filter, setFilter] = useState<'todos' | 'eventos' | 'bastidores' | 'tradicao'>('todos');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('radio_liked_posts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    INITIAL_POSTS.forEach((p) => {
      initial[p.id] = p.initialLikes;
    });
    return initial;
  });

  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const toggleLike = (postId: string) => {
    const isCurrentlyLiked = !!likedPosts[postId];
    const newLiked = { ...likedPosts, [postId]: !isCurrentlyLiked };
    setLikedPosts(newLiked);
    localStorage.setItem('radio_liked_posts', JSON.stringify(newLiked));

    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isCurrentlyLiked ? -1 : 1),
    }));
  };

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSharePost = async (post: SocialPost) => {
    const text = `Confira esta novidade da Rádio de Pátria e Querência:\n\n*${post.title}*\n"${post.caption}"\n\nAcompanhe ao vivo pelo aplicativo oficial: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text,
          url: window.location.origin,
        });
        return;
      } catch {
        // Fallback to whatsapp
      }
    }
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setShareFeedback(post.id);
    setTimeout(() => setShareFeedback(null), 2500);
  };

  const filteredPosts =
    filter === 'todos'
      ? INITIAL_POSTS
      : INITIAL_POSTS.filter((p) => p.category === filter);

  return (
    <section className="w-full space-y-6 pt-4" aria-labelledby="feed-heading">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            Notícias & Redes Sociais
          </div>
          <h2 id="feed-heading" className="text-xl sm:text-2xl font-bold font-display text-white">
            Mural de Eventos da Querência
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Fique por dentro dos festivais, rodeios, bastidores e novidades da emissora
          </p>
        </div>

        {/* Official Social Links Quick Strip */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 text-pink-300 text-xs font-semibold transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors"
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('todos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'todos'
              ? 'bg-amber-600 text-slate-950 shadow-sm'
              : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          Todos os Posts
        </button>
        <button
          onClick={() => setFilter('eventos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'eventos'
              ? 'bg-amber-600 text-slate-950 shadow-sm'
              : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          Eventos & Festivais
        </button>
        <button
          onClick={() => setFilter('tradicao')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'tradicao'
              ? 'bg-amber-600 text-slate-950 shadow-sm'
              : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          Tradição Campeira
        </button>
        <button
          onClick={() => setFilter('bastidores')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'bastidores'
              ? 'bg-amber-600 text-slate-950 shadow-sm'
              : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          Bastidores & Estúdio
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => {
          const isLiked = !!likedPosts[post.id];
          const isBookmarked = !!bookmarkedPosts[post.id];
          const currentLikes = likeCounts[post.id] || post.initialLikes;

          return (
            <article
              key={post.id}
              className="rounded-2xl bg-[#111A1F] border border-amber-900/30 overflow-hidden shadow-xl shadow-black/60 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300"
            >
              {/* Post Header: Profile & Location */}
              <div className="p-3.5 flex items-center justify-between gap-3 bg-black/30 border-b border-white/5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src="/assets/aistudio/image_15260716.png"
                    alt={post.author}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full bg-slate-900 p-0.5 border border-amber-500/50 object-contain shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {post.author}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{post.location}</span>
                      <span>·</span>
                      <span className="shrink-0">{post.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmark(post.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'text-amber-400 bg-amber-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label={isBookmarked ? 'Remover dos salvos' : 'Salvar publicação'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Post Media Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/60 group">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-white/10 uppercase tracking-wider">
                  {post.category === 'eventos'
                    ? 'Festival & Evento'
                    : post.category === 'tradicao'
                    ? 'Cultura Gaúcha'
                    : 'Estúdio & Bastidores'}
                </span>
              </div>

              {/* Post Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white font-display leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] text-amber-400/90 font-medium hover:underline cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Engagement Action Bar (Like, Share, Comments) */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Like button */}
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isLiked
                          ? 'text-red-400 scale-105'
                          : 'text-slate-400 hover:text-red-400'
                      }`}
                      aria-label="Curtir post"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform ${
                          isLiked ? 'fill-red-500 text-red-500 animate-scale' : ''
                        }`}
                      />
                      <span className="tabular-nums font-mono text-[11px]">
                        {currentLikes}
                      </span>
                    </button>

                    {/* Comments count */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="tabular-nums font-mono text-[11px]">
                        {post.commentsCount}
                      </span>
                    </div>
                  </div>

                  {/* Share button */}
                  <button
                    onClick={() => handleSharePost(post)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-600/20 text-slate-300 hover:text-amber-400 text-xs font-medium transition-colors cursor-pointer border border-white/5"
                    title="Compartilhar no WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Community Call to Action Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#111A1F] to-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Quer divulgar o evento ou rodeio do seu CTG na rádio?
            </h4>
            <p className="text-xs text-slate-300">
              Envie fotos e detalhes da sua festa campeira diretamente pelo nosso WhatsApp.
            </p>
          </div>
        </div>

        <a
          href="https://api.whatsapp.com/send?text=Buenas!%20Gostaria%20de%20enviar%20uma%20divulga%C3%A7%C3%A3o%20de%20evento%20para%20a%20R%C3%A1dio%20de%20P%C3%A1tria%20e%20Quer%C3%AAncia!"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold text-xs flex items-center gap-2 whitespace-nowrap shadow-md cursor-pointer transition-transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          Enviar Evento no WhatsApp
        </a>
      </div>
    </section>
  );
};
