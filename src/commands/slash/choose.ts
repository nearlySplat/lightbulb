import { SlashCommandExecute } from '../../types';
import { CLIENT_COLOUR } from '../../constants';
let arr = [],
  obj = {
    one: 'first',
    two: 'second',
    three: 'third',
    four: '~th',
    five: 'fifth',
    six: '~th',
    seven: '~th',
    eight: '~th',
    nine: '~th',
    ten: 'last',
  };
const h = 'h'
  .repeat(10)
  .split('')
  .map((_, i) => i - 1);
for (const i of h) {
  if (i >= 0) {
    arr.push({
      type: 3,
      name: Object.keys(obj)[i],
      description: `The ${Object.values(obj)[i].replace(
        /^~/g,
        Object.keys(obj)[i]
      )} choice.${i === 9 ? " You can seperate more choices with ';'" : ''}`,
      required: i < 2,
    });
  }
}

export const meta = {
  name: 'choose',
  description: 'Choose between the supplied choices',
  options: arr,
};

export const execute: SlashCommandExecute = ({
  interaction: {
    data: { options },
  },
}) => {
  const args = options!.map(v => v.value);
  return {
    type: 4,
    data: {
      embeds: [
        {
          description: `I choose **${
            args[Math.floor(Math.random() * args.length)]
          }**!`,
          color: CLIENT_COLOUR,
          title: 'My choice',
          footer: { text: 'Ooh I like slash commands' },
        },
      ],
    },
  };
};
