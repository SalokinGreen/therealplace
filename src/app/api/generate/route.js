import { NextResponse } from "next/server";
import axios from "axios";
const parameters = {
  temperature: 1,
  max_length: 150,
  min_length: 1,
  top_a: 0.017,
  typical_p: 0.975,
  repetition_penalty: 3,
  repetition_penalty_range: 7680,
  repetition_penalty_slope: 0.09,
  repetition_penalty_frequency: 0,
  repetition_penalty_presence: 0,
  phrase_rep_pen: "aggressive",
  bad_words_ids: [
    [21],
    [49209, 21],
    [21],
    [49209, 21],
    [21],
    [49209, 21],
    [21],
    [49209, 21],
    [21],
    [49209, 21],
  ],
  stop_sequences: [
    [85, 49810],
    [49308, 49215, 49810],
  ],
  repetition_penalty_whitelist: [
    49256, 49264, 49231, 49230, 49287, 85, 49255, 49399, 49262, 336, 333, 432,
    363, 468, 492, 745, 401, 426, 623, 794, 1096, 2919, 2072, 7379, 1259, 2110,
    620, 526, 487, 16562, 603, 805, 761, 2681, 942, 8917, 653, 3513, 506, 5301,
    562, 5010, 614, 10942, 539, 2976, 462, 5189, 567, 2032, 123, 124, 125, 126,
    127, 128, 129, 130, 131, 132, 588, 803, 1040, 49209, 4, 5, 6, 7, 8, 9, 10,
    11, 12,
  ],
  generate_until_sentence: true,
  use_string: true,
  return_full_text: false,
  prefix: "vanilla",
  logit_bias_exp: [
    {
      sequence: [23],
      bias: -0.08,
      ensure_sequence_finish: false,
      generate_once: false,
    },
    {
      sequence: [21],
      bias: -0.08,
      ensure_sequence_finish: false,
      generate_once: false,
    },
  ],
  num_logprobs: 10,
  order: [5, 0, 4],
};
export async function POST(request) {
  const req = await request.json();
  const context = req.context;
  console.log(context);
  //   const parameters = req.parameters;
  const gens = req.gens;
  const key = req.key;
  const results = [];

  for (let i = 0; i < gens; i++) {
    const response = await axios
      .post(
        "https://api.novelai.net/ai/generate",
        {
          input: context,
          parameters: parameters,
          model: req.model,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${key}`,
          },
        }
      )
      .catch((err) => {
        console.log(err);
        return NextResponse.json(err);
      });
    const result = response.data.output;
    results.push(result);
  }
  return NextResponse.json({ results });
}
