import Core from 'bonde-webhook-core'
import dotenv from 'dotenv'
dotenv.config()

const init = async () => {
  // Instancia um servidor para e passa o nome da instância para visualização dos logs
  const Server = new Core.Server('mautic')
  // Esse método pode ser extendido para que a informação seja adicionada a outra tabela, por exemplo
  await Server.logTo()
  // Esse método pode ser extendido para configurar o servidor de outras formas
  await Server.listen()
}

init()
