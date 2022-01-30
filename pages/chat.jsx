import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import LocationOn from '@material-ui/icons/LocationOn'
import { IconButton, sendIcon } from '@material-ui/core';
import { createClient } from '@supabase/supabase-js';
import { api } from '../api.js'
import Modal from '@mui/material/Modal';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { useRouter } from 'next/router';

export default function ChatPage({ username }) {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [githubData, setGithubData] = useState({})
  const route = useRouter();

  const supabaseClient = createClient(
    'https://pjcddalbuqnotirmwpej.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyODE1MywiZXhwIjoxOTU4OTA0MTUzfQ.p0NvOU5LN1m1Ii44sFzaZNqfsMe6XVpk5WFkg0n0YY0'
  )

  const getGithubData = (name) => {
    api.get(name)
      .then(({ data }) => {
        console.log('All Data', data)
        const { name, location, url, followers, bio, login, company } = data;
        const tempGithubData = {
          photo: `https://github.com/${login}.png`,
          name: name,
          location: location,
          url: url,
          followers: followers,
          bio: bio,
          company: company
        }
        getGithubRepos(login, tempGithubData);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getGithubRepos = (login, tempGithubData) => {
    api.get(login + '/repos')
      .then(({ data }) => {
        setGithubData({
          ...tempGithubData,
          repos: data
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleRealTimeMessages = () => {
    supabaseClient
      .from('mensagens')
      .on('INSERT', (response) => {
        setMensagens(oldMessage => [response.new, ...oldMessage])
      })
      .subscribe();
  }

  const handleDeleteMessages = () => {
    supabaseClient
      .from('mensagens')
      .on('DELETE', (response) => {
        console.log('deletou', response)
      })
      .subscribe();
  }

  const insertMessage = () => {
    if (mensagem) {
      supabaseClient
        .from('mensagens')
        .insert(
          [
            {
              name: username,
              message: mensagem
            }
          ]
        )
        .then(() => {
          setMensagem('');
        })
    }
  }

  const selectMessages = () => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMensagens(data)
      })
  }

  useEffect(() => {
    console.log('GithubData', githubData)
  }, [githubData])

  useEffect(() => {
    insertMessage()
  }, [mensagem.includes('.gif')])

  useEffect(() => {
    selectMessages();
    handleRealTimeMessages();
  }, [])

  useEffect(() => {
    if (!username) {
      route.push('/')
    }
  }, [])

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        // backgroundColor: appConfig.theme.colors.primary[500],
        // backgroundImage: `url(https://images.unsplash.com/photo-1625632019469-108132f8fc60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)`,
        backgroundColor: '#000',
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '50%',
          maxHeight: '85vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList
            mensagens={mensagens}
            setMensagens={setMensagens}
            setOpenModal={setOpenModal}
            getGithubData={getGithubData}
            username={username}
            handleDeleteMessages={handleDeleteMessages}
          />
          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              autoFocus={!mensagem}
              placeholder="Insira sua mensagem aqui..."
              value={mensagem}
              onChange={(e) => {
                setMensagem(e.target.value)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  insertMessage()
                }
              }}
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <Button
              label='Enviar'
              styleSheet={{
                height: '48px',
                marginBottom: '8px',
                marginRight: '8px',
                backgroundColor: !mensagem ? appConfig.theme.colors.neutrals[800] : appConfig.theme.colors.primary[600],
              }}
              onClick={() => insertMessage()}
            />

            <ButtonSendSticker
              setMensagem={setMensagem}
              insertMessage={insertMessage}
            />

          </Box>

        </Box>
      </Box>
      <GitHubModal 
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleCloseModal={handleCloseModal}
        githubData={githubData}
      />
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList({
  mensagens,
  setOpenModal,
  getGithubData,
  username,
  handleDeleteMessages
}) {

  const supabaseClient = createClient(
    'https://pjcddalbuqnotirmwpej.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyODE1MywiZXhwIjoxOTU4OTA0MTUzfQ.p0NvOU5LN1m1Ii44sFzaZNqfsMe6XVpk5WFkg0n0YY0'
  )

  const handleDeleteMessage = (mensagem) => {
    if (mensagem.name === username) {
      supabaseClient
        .from('mensagens')
        .delete()
        .match({ id: mensagem.id })
    } else {
      // não pode a pagar mensagem que não é de seu usuário
    }
  }


  const handleMessageDate = (created_at) => {
    const dateOptions = {
      dataHoje: new Date().toLocaleDateString('pt-BR', {
        timezone: 'America/Sao_Paulo'
      }),
      dataOntem: new Date(new Date().setDate(new Date().getDate() - 1))
        .toLocaleDateString('pt-BR', {
          timezone: 'America/Sao_Paulo'
      }),
      dataMensagem: new Date(created_at)
        .toLocaleDateString('pt-BR', {
          timezone: 'America/Sao_Paulo'
      }),
      dataMensagemCurta: new Date(created_at)
        .toLocaleDateString('pt-BR', {
          timezone: 'America/Sao_Paulo',
          day: 'numeric',
          month: '2-digit'
      }),
      horaMensagem: new Date(created_at)
        .toLocaleTimeString('pt-BR', {
          timezone: 'America/Sao_Paulo',
          timeStyle: 'short'
      }),
    }

    const { dataHoje, dataOntem, dataMensagem, dataMensagemCurta, horaMensagem} = dateOptions

    return (
      (dataMensagem === dataHoje && 'Hoje às ' + horaMensagem) || 
      (dataMensagem === dataOntem && 'Ontem às ' + horaMensagem) ||
      (dataMensagemCurta + ' às ' + horaMensagem)
    )

  }

  const handleMessageType = (mensagem) => {
    return (
      mensagem.includes('http')
        ? (
          <Image src={mensagem}
            styleSheet={{
              maxWidth: '30%',
            }}
          />
        ) : (
          mensagem
        )
    )
  }

  return (
    <Box
      tag="ul"
      styleSheet={{
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
        overflowY: 'scroll'
      }}
    >

      {mensagens.map(mensagem => (

        <Text
          key={mensagem.id}
          tag="li"
          styleSheet={{
            borderRadius: '5px',
            padding: '6px',
            marginBottom: '12px',
            hover: {
              backgroundColor: appConfig.theme.colors.neutrals[700],
            }
          }}
        >
          <Box
            styleSheet={{
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Image
              styleSheet={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: '8px',
                cursor: 'pointer'
              }}
              src={`https://github.com/${mensagem.name}.png`}
              onClick={() => {
                setOpenModal(true)
                getGithubData(mensagem.name)
              }}
            />
            <Text tag="strong">
              From {mensagem.name}
            </Text>
            <Text
              styleSheet={{
                fontSize: '12px',
                marginLeft: '8px',
                color: appConfig.theme.colors.neutrals[100],
              }}
              tag="span"
            >
              {handleMessageDate(mensagem.created_at)}
            </Text>
            <Box
              styleSheet={{
                marginLeft: 'auto'
              }}
            >
              <IconButton
                onClick={() => {
                  handleDeleteMessage(mensagem)
                }}
              >
                <DeleteIcon color="secondary" />
              </IconButton>
            </Box>
          </Box>
          {handleMessageType(mensagem.message)}
        </Text>

      ))}

    </Box>
  )
}

function GitHubModal({ openModal, setOpenModal, handleCloseModal, githubData }) {

  console.log('Chegou no modal', githubData)

  const { bio, company, followers, location, name, photo, repos, url } = githubData;

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
    > 
      <Box styleSheet={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>

      <Box 
        styleSheet={{ 
          width: '30vw', 
          height: '50vh', 
          backgroundColor: appConfig.theme.colors.neutrals[800],
          border: '1px solid #FFF',
          position: 'relative',
          overflowY: 'scroll',

        }}>

        <Box as="header"
          styleSheet={{
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            height: '20vh'
          }}
        >
          <Image 
            src={photo}
            styleSheet={{
              maxHeight: '100%',
              borderRadius: '50%'
            }}
          />

          <Box 
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
          >

            <Text
              styleSheet={{ color: '#FFF', fontWeight: 'bold'}}
            >
              {company ? (name + ' - ' + company) : (name)}
            </Text>

            <Box
              styleSheet={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginLeft: '-5px'
              }}
            >
              <LocationOn color="primary" />
              <Text
                styleSheet={{ color: '#FFF'}}
              >
                {location}
              </Text>
            </Box>
            <Text
              styleSheet={{
                color: '#FFF'
              }}
            >
              {bio}
            </Text>

          </Box>
          <Box
            styleSheet={{
              position: 'absolute',
              top: '5px',
              right: '0',
            }}
          >
            <IconButton
              onClick={handleCloseModal}
            >
              <CloseIcon color="secondary" />
            </IconButton>
          </Box>
        </Box>

        <Box 
        styleSheet={{
          display: 'flex',
          marginBottom: '10px',
          justifyContent: 'space-evenly'
        }}>
            <Box as="a" href="" target="_blank"
              styleSheet={{
                textDecoration: 'none',
                color: '#FFF',
                backgroundColor: appConfig.theme.colors.neutrals[700],
                padding: '5px',
                display: 'inline-block',
                borderRadius: '10px',
                fontSize: '14px',
                width: '30%',
                display: 'grid',
                placeItems: 'center',
                cursor: 'default'
              }}
            >{followers + ' ' + 'Seguidores'}</Box>
          <Box as="a" href={url} target="_blank"
              styleSheet={{
                textDecoration: 'none',
                color: '#FFF',
                backgroundColor: appConfig.theme.colors.neutrals[700],
                padding: '5px',
                display: 'inline-block',
                borderRadius: '10px',
                fontSize: '14px',
                width: '30%',
                display: 'grid',
                placeItems: 'center',
              }}
          >Acessar Repositório</Box>

        </Box>

        <Box as="hr" color={appConfig.theme.colors.neutrals[900]}
        ></Box>
        <Box as="main"
          styleSheet={{
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',

          }}
        >
          <Text
            styleSheet={{
              color: "#FFF",
              fontSize: '18px',
              alignSelf: 'center'
            }}
          >
            Projetos
          </Text>

          <Box as="section" styleSheet={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            
          }}>

            {repos?.map(project => (

              <Box 
                styleSheet={{
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                justifyContent: 'center',
                gap: '10px',
                color: '#FFF',
                backgroundColor: appConfig.theme.colors.neutrals[900],
                borderRadius: '10px'
              }}>
                <Text
                  styleSheet={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {project.name}</Text>
                <Text
                  styleSheet={{
                    fontSize: '12px',
                    textAlign: 'center'
                  }}
                >{new Date(project.pushed_at).toLocaleDateString('pt-BR', {
                  timezone: 'America/Sao_Paulo'
                })}</Text>
                <Box as="a" href={project.url} target="_blank"
                  styleSheet={{
                    textDecoration: 'none',
                    color: '#FFF',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    padding: '5px',
                    display: 'inline-block',
                    borderRadius: '10px',
                    fontSize: '14px',
                    width: '70%',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto'
                  }}
                >Link</Box>

              </Box>

            ))}

          </Box>


        </Box>
      </Box>

      </Box>
    </Modal>
  )

}