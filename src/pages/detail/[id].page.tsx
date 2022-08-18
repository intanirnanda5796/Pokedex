import { PokemonLogo } from "../../../public/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Progress, Tag, Tabs } from "antd";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  AbilityType,
  DetailResponse,
  StatsType,
  TypesType,
} from "../../types/detail.type";

export default function Detail() {
  const [data, setData] = useState<DetailResponse>({} as DetailResponse);
  const router = useRouter();
  const id = router.query.id;
  const { TabPane } = Tabs;

  const fetchData = useCallback(() => {
    let endpoints: string[] = [
      `https://pokeapi.co/api/v2/pokemon/${id}`,
      `https://pokeapi.co/api/v2/pokemon-species/${id}`,
    ];

    Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
      (result) => {
        let obj = {} as DetailResponse;
        obj.name = result[0].data.name;
        obj.urlImage = result[0].data.sprites.front_default;
        obj.description = [
          ...new Map(
            result[1].data.flavor_text_entries
              .filter(
                (val: { language: { name: string } }) =>
                  val.language.name === "en"
              )
              .map((item: { flavor_text: string }) => [
                item["flavor_text"],
                item,
              ])
          ).values(),
        ]
          .map((val: any) => val.flavor_text)
          .join(" ");
        obj.stats = result[0].data.stats.map((val: StatsType) => ({
          ...val,
          name: val.stat.name,
          base_stat: val.base_stat,
        }));
        obj.abilities = result[0].data.abilities.map(
          (val: AbilityType) => val.ability
        );
        obj.types = result[0].data.types.map((val: TypesType) => val.type.name);
        setData(obj);
      }
    );
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="w-screen z-10 bg-blue-800 top-0">
        <div className="flex justify-between items-center py-0 px-4 md:flex md:justify-between md:px-4 md:items-center">
          <Link href="/"><Image className="px-2" src={PokemonLogo} alt="logo" width={150} /></Link>
        </div>
      </div>

      <div className="mx-auto pt-10 pb-20 px-20">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/">
                <a className="inline-flex items-center text-base font-medium text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Homepage
                </a>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-base text-gray-700 font-bold md:ml-2 ">
                  Pokemon Detail
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {Object.keys(data).length > 0 && (
          <div className="pt-5 flex flex-col">
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <div className="flex flex-col md:flex-row">
              <Image
                src={data.urlImage}
                alt="pokemon"
                height={1000}
                width={1000}
              />
              <div className="flex flex-col space-y-3">
                <p className="font-semibold text-lg">Description : </p>
                <p dangerouslySetInnerHTML={{ __html: data.description }} />
                <p className="font-semibold text-lg">Base Stats : </p>
                <div className="flex flex-col space-y-3">
                  {data.stats.map((val, i) => (
                    <div
                      key={i}
                      className="flex flex-row items-center space-x-5"
                    >
                      <p>{val.name}</p>
                      <Progress percent={val.base_stat} steps={11} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Tabs defaultActiveKey="1" className="pt-2">
              <TabPane tab="Types" key="1">
                <div className="flex flex-row">
                  {data.types.map((val: any, i) => (
                    <Tag
                      key={i}
                      color="#55acee"
                      className="text-sm rounded-lg px-2 py-1"
                    >
                      {val}
                    </Tag>
                  ))}
                </div>
              </TabPane>
              <TabPane tab="Abilities" key="2">
                <div className="flex flex-col space-y-3">
                  {data.abilities.map((val: AbilityType, i) => (
                    <Tag
                      key={i}
                      color="#55acee"
                      className="text-sm rounded-lg px-2 py-1"
                    >
                      {val.ability}
                    </Tag>
                  ))}
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
    </>
  );
}
