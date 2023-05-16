import { Meta } from "@storybook/web-components";
import { html } from "lit";
import "./dataTable";
import { sampleData, sampleHeaders } from "./sampleData";

export default {
  title: "DataTable",
  parameters: {
    layout: "padded",
  },
  component: "high-data-table",
  render: (args) =>
    html`<high-data-table
      title=${args.title}
      color=${args.color}
      config=${args.config}
      headers=${args.headers}
      data=${args.data}
    ></high-data-table>`,
} as Meta;

const Template = ({ title, headers, data, config, color }) =>
  html`<div style="">
    <high-data-table
      title=${title}
      color=${color}
      config=${JSON.stringify(config)}
      headers=${JSON.stringify(headers)}
      data=${JSON.stringify(data)}
    ></high-data-table>
  </div>`;

export const AllProps = Template.bind({});
AllProps.args = {
  title: "Header",
  headers: sampleHeaders,
  data: sampleData(),
  config: { rowId: "CompanyProductTransactionTypeID" },
  color: "principal",
};

export const Highlight = Template.bind({});
Highlight.args = {
  title: "Highlight",
  headers: sampleHeaders,
  data: sampleData,
  config: { rowId: "CompanyProductTransactionTypeID" },
  color: "highlight",
};
