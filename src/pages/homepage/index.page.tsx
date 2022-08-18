import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Select, Spin } from "antd";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { DataResponse, DataTypes } from "../../types/index.type";
import { PokemonLogo } from "../../../public/assets";
import { leadingZeros } from "../../utils/general";

export default function Homepage() {
  const [data, setData] = useState<DataResponse[] | []>([]);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [listSelect, setListSelect] = useState<[]>([]);
  const router = useRouter();
  const { Option } = Select;

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchData = useCallback(() => {
    let endpoints: string[] = [
      'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
      'https://pokeapi.co/api/v2/type'
    ];
    Promise.all(endpoints.map(endpoint => axios.get(endpoint))).then(result => {
      setTotal(result[0].data.count);
      result[0].data.results.map(
        (val: { name: string; url: string }) => {
          axios.get(val.url).then((resultPokemon) => {
            axios
              .get(resultPokemon.data.species.url)
              .then((resultSpesies) => {
                let obj = {} as DataResponse;
                obj.name = val.name;
                obj.id = resultPokemon.data.id;
                obj.height = resultPokemon.data.height;
                obj.weight = resultPokemon.data.weight;
                obj.urlImage = resultPokemon.data.sprites.front_default;
                obj.types = resultPokemon.data.types.map(
                  (val: DataTypes) => val.type.name
                );
                obj.color = resultSpesies.data.color.name;
                setData((prevData) => [...prevData, obj]);
              });
          });
        }
      );
      setListSelect(result[1].data.results);
    })
  }, []);

  const colors: { [key: string]: string } = {
    black: 'bg-blackLight',
        blue: 'bg-blueLight',
        brown: 'bg-brown',
        gray: 'bg-grayLight',
        green: 'bg-greenLight',
        pink: 'bg-pinkLight',
        purple: 'bg-purpleLight',
        red: 'bg-redLight',
        white: 'bg-whiteLight',
        yellow: 'bg-yellowLight'
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setTimeout(() => {
      try {
        axios
          .get(
            `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page === 1 ? Math.ceil(
              page * 20
            ): Math.ceil((page - 1) * 20)}`
          )
          .then(resultPagination => {
            resultPagination.data.results.map(
              (val: { name: string; url: string }) => {
                axios.get(val.url).then((resultPokemon) => {
                  axios
                    .get(resultPokemon.data.species.url)
                    .then((resultSpesies) => {
                      let obj = {} as DataResponse;
                      obj.name = val.name;
                      obj.id = resultPokemon.data.id;
                      obj.height = resultPokemon.data.height;
                      obj.weight = resultPokemon.data.weight;
                      obj.urlImage = resultPokemon.data.sprites.front_default;
                      obj.types = resultPokemon.data.types.map(
                        (val: DataTypes) => val.type.name
                      );
                      obj.color = resultSpesies.data.color.name;
                      setData(prevData => (prevData as DataResponse[]).concat(obj));
                    });
                });
              }
            );
          });
      } catch (e) {
        console.log(e);
      }
    }, 2000);
  }, [page]);

  useEffect(() => {
    if (keyword !== '') {
      setData(prevData => prevData.filter((val: any) => val.types.includes(keyword)));
    } else {
      axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`)
      .then((resultPagination) => {
        resultPagination.data.results.map(
          (val: { name: string; url: string }) => {
            axios.get(val.url).then((resultPokemon) => {
              axios
                .get(resultPokemon.data.species.url)
                .then((resultSpesies) => {
                  let obj = {} as DataResponse;
                  obj.name = val.name;
                  obj.id = resultPokemon.data.id;
                  obj.height = resultPokemon.data.height;
                  obj.weight = resultPokemon.data.weight;
                  obj.urlImage = resultPokemon.data.sprites.front_default;
                  obj.types = resultPokemon.data.types.map(
                    (val: DataTypes) => val.type.name
                  );
                  obj.color = resultSpesies.data.color.name;
                  setData((prevData) => [...prevData, obj]);
                });
            });
          }
        );
      });
    }
  }, [keyword]);

  const onDetail = (id: number) => {
    router.push({
      pathname: '/detail/[id]',
      query: { id }
    });
  };

  const onChange = (value: string) => {
    setKeyword(value);
  };

  return (
    <>
      <div className="w-screen z-10 bg-blue-800 top-0">
        <div className="flex justify-between items-center py-0 px-4 md:flex md:justify-between md:px-4 md:items-center">
          <Link href="/"><Image className="px-2" src={PokemonLogo} alt="logo" width={150} /></Link>
        </div>
      </div>

      <div className="mx-auto">
        <div className="pt-10 pb-20 px-20">
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 justify-between items-center">
            <h1 className="text-2xl md:text-4xl font-bold text-blue-600 ">
              Pokedex Pokemon
            </h1>
            <div>
              <Select
                className="w-64"
                value={keyword}
                placeholder="Select to filter"
                onChange={onChange}
              >
                <Option value="">Pilih Tipe</Option>
                {
                  listSelect && listSelect.map((val: {name: string}, i) => (
                    <Option key={i} value={val.name}>{val.name}</Option>
                  ))
                }
              </Select>
            </div>
          </div>
          <InfiniteScroll 
            dataLength={data.length}
            next={loadMore}
            hasMore={total > data.length}
            loader={
              <div className="flex mx-auto justify-center items-center w-screen">
                  <Spin tip="Loading...." size="large" />
              </div>
            }
            className="pt-7 grid grid-cols-1 md:grid-cols-4 items-center space-x-5 space-y-5 flex"
            >
            {data &&
              [...new Map(data.map(item =>
                [item['name'], item])).values()].map((val, i) => (
                <div
                  key={i}
                  className={`${colors[val.color]} px-4 py-4 rounded-xl flex flex-col mx-auto hover:scale-105`}
                  onClick={() => onDetail(val.id)}
                >
                  <p className="flex text-base font-light text-white">#{leadingZeros(i + 1, 4)}</p>
                  <Image
                    className="flex -mt-5 mx-auto"
                    src={val.urlImage}
                    alt="pokemon"
                    width={250}
                    height={250}
                  />
                  <h1 className="flex mx-auto -mt-3 text-xl font-semibold text-white">
                    {val.name}
                  </h1>
                  <div className="flex flex-row justify-between px-10">
                    <div className="flex flex-col">
                      <p className="flex text-base font-medium text-white mt-2">
                        Weight
                      </p>
                      <p className="flex text-sm font-light text-white mx-auto">
                        {val.weight}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="flex text-base font-medium text-white mt-2">
                        Height
                      </p>
                      <p className="flex text-sm font-light text-white mx-auto">
                        {val.height}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
        </div>
      </div>
    </>
  );
}
