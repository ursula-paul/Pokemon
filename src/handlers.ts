import { Stat } from "./models/Stat";
import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";

//import { PokemonWithStats } from "models/PokemonWithStats";
//import Server from "server";

import { Stat as stats } from "models/Stat";

export async function getPokemonByName(
  request: FastifyRequest,
  reply: FastifyReply
) {
  var name: string = request.params["name"];
  console.log(name);

  reply.headers["Accept"] = "application/json";

  var urlApiPokeman = `https://pokeapi.co/api/v2/pokemon/`;

  var params = {};

  name == null
    ? name.trim() != ""
      ? ((params["name"] = name),
        (urlApiPokeman = urlApiPokeman + "/"),
        (urlApiPokeman = urlApiPokeman + name))
      : ((urlApiPokeman = urlApiPokeman + '"?offset=20"'),
        (urlApiPokeman = urlApiPokeman + "&limit=20"))
    : ((urlApiPokeman = urlApiPokeman + '"?offset=20"'),
      (urlApiPokeman = urlApiPokeman + "&limit=20"));

  const http = require("http");
  const keepAliveAgent = new http.Agent({ keepAlive: true });

  let response: any = [];

  console.log("bdsbzxbd");

  // let data = await axios.get(urlApiPokeman);
  // console.log(data.data, "dfhskjhdj");
  http.request(
    { ...reply.headers, ...{ hostname: urlApiPokeman, port: 80 } },
    (result) => {
      response = result;

      console.log(result, "i am here");
    }
  );
  console.log("mehdshgabehsgbh");
  return reply.send({ name: "me" });

  if (response == null) {
    reply.code(404);
  }

  computeResponse(response, reply);

  return reply.send(response);
}

export const computeResponse = async (
  //response: unknown,
  response: any,
  reply: FastifyReply
) => {
  const resp = response as any;

  let types = resp.types
    .map((type) => type.type)
    .map((type) => {
      return type.url;
    })
    .reduce((types, typeUrl) => types.push(typeUrl));

  let pokemonTypes = [];

  types.forEach((element) => {
    const http = require("http");
    const keepAliveAgent = new http.Agent({ keepAlive: true });

    http.request({ hostname: element }, (response) =>
      pokemonTypes.push(response)
    );
  });

  if (pokemonTypes == undefined) throw pokemonTypes;

  response.stats.forEach((element: any) => {
    var stats = [];

    pokemonTypes.map((pok) =>
      pok.stats.map((st) =>
        st.stat.name.toUpperCase() == element.stat.name
          ? stats.push(st.base_state)
          : []
      )
    );

    if (stats) {
      let avg = stats.reduce((a, b) => a + b) / stats.length;
      element.averageStat = avg;
    } else {
      element.averageStat = 0;
    }
  });

  return reply.send(pokemonTypes);
};
