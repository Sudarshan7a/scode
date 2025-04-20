export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-24">
      main page{process.env.NEXT_PUBLIC_API_URL}
    </div>
  );
}
