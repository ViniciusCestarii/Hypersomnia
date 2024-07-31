import useHypersomniaStore from '@/zustand/hypersomnia-store'

const ResponseCookiesTab = () => {
  const cookies = useHypersomniaStore((state) => state.cookies)

  return cookies.map(({ name, value }) => (
    <div key={name} className="flex items-center space-x-2">
      <div className="text-sm font-semibold">{name}</div>
      <div className="text-sm text-gray-500">{value}</div>
    </div>
  ))
}

export default ResponseCookiesTab
