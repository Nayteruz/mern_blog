import { ROUTES } from "@/shared/const/routes";
import { IPost } from "@/shared/types";
import { PostCard } from "@/shared/UI/PostCard";
import { Button, Select, TextInput } from "flowbite-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value.trim();

    if (e.target.id === "searchTerm") {
      setSidebarData((prev) => ({ ...prev, searchTerm: value }));
    }
    if (e.target.id === "sort") {
      setSidebarData((prev) => ({ ...prev, sort: value || "desc" }));
    }
    if (e.target.id === "category") {
      setSidebarData((prev) => ({
        ...prev,
        category: value || "uncategorized",
      }));
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`${ROUTES.SEARCH}?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex.toString());
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);

    if (!res.ok) {
      return;
    }

    if (res.ok) {
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setShowMore(data.posts.length === 9);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const sortUrl = urlParams.get("sort");
    const categoryUrl = urlParams.get("category");

    if (searchTermUrl || sortUrl || categoryUrl) {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: searchTermUrl || prev.searchTerm,
        sort: sortUrl || prev.sort,
        category: categoryUrl || prev.category,
      }));

      const fetchPosts = async () => {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          setLoading(false);
          return;
        }

        setPosts(data.posts);
        setLoading(false);
        setShowMore(data.posts.length === 9);
      };

      fetchPosts();
    }
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Поиск:
            </label>
            <TextInput
              placeholder="Поиск..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={onChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="sort" className="whitespace-nowrap font-semibold">
              Сортировка:
            </label>
            <Select id="sort" value={sidebarData.sort} onChange={onChange}>
              <option value="desc">Новее</option>
              <option value="asc">Старее</option>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="category"
              className="whitespace-nowrap font-semibold"
            >
              Категория:
            </label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={onChange}
            >
              <option value="unvategorized">Без категории</option>
              <option value="javascript">Javascript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Искать
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-bold sm:border-b border-gray-500 p-3 mt-5">
          Список постов
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">Не найдено ни одного поста</p>
          )}
          {loading && <p className="text-xl text-gray-500">Загрузка...</p>}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                className="md:max-w-[300px]"
              />
            ))}
          {/* {showMore && ( */}
          <button
            onClick={handleShowMore}
            className="text-teal-500 text-lg hover:underline p-7 size-full"
          >
            Показать еще
          </button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};
