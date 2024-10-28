import loading from "loading-cli";
export class WibuLog{
    static log: () => loading.Loading = () =>  loading("").start();
}