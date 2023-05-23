/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import useFetch from "../helpers/useFetch"
import useMutationFetch from "../helpers/useloadFetch"
import Loading from "./Loading"
import LoadingButton from "./LoadingButton"

const Container = () => {
  const [dataChar, setDataChar] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, loading, error } = useFetch({
    method: 'GET',
    url: `/api/character?page=${page}`,
    skip: page > 1
  })

  const { data: dataLoad, mutation, error: errorLoad, loading: load } = useMutationFetch({
    method: 'GET',
    url: `/api/character`
  })

  const characters = useMemo(() => {
    const data = dataChar?.reduce?.((acc, curr) => ([...acc, ...curr.characters]), [])
    console.log("data reduce", data)
    return data.filter((char) => `${char.name} ${char.species}`.toLowerCase().includes(search.toLowerCase()))
  }, [dataChar, search])

  useEffect(() => {
    if (data) {
      const chars = data?.results?.map((char) => ({ id: `${page} - ${char.id}`, name: char.name, species: char.species, image: char.image }))
      setDataChar([{ page: 1, characters: chars }])
    }
  }, [data])

  const loadMore = () => {
    mutation({ params: {page: page + 1} })
  }

  useEffect(() => {
    if (dataLoad) {
      setDataChar((prev) => {
        // console.log("prev", prev)
        const data = prev.filter((val) => val.page !== page + 1)
        const chars = dataLoad.results.map((char) => ({ id: `${page + 1}-${char.id}`, name: char.name, species: char.species, image: char.image }))
        return [...data, { page: page + 1, characters: chars }]
       
      })
      
      setPage((prev) => prev + 1)
    }
  }, [dataLoad])


  console.log('data', dataChar)

  return (
    <>
      <ContrainerStyled>
        <div className="header-root">
          <div className="header-left">
            <p className="header-title">Rick and Morthy Characters</p>
          </div>

          <div className="header-right">
            <button className="header-button">Characters</button>
            <button className="header-button">Locations</button>
            <button className="header-button">Episodes</button>
          </div>
        </div>

        <div className="content-root">
          {!error && (
            <>
              <div className="char-search" >
                <p>Search</p>
                <input value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <p className="page-detail">{page} of Pages</p>
            </>
          )}

          {loading && <Loading />}
          {!loading && (
            <div className="characters-cards">
              {characters?.map((char) => (
                <>
                  <div className="character-card">
                    <div className="character-image">
                        <img src={char?.image} alt="karakter-image" />
                    </div>
                    <div className="character-name"><p>{char?.name}</p></div>
                    <div className="character-species"><p>{char?.species}</p></div>
                  </div>
                </>
              ))}
            </div>
          )}

          {(error || errorLoad) && (
            <div className="error-fetch">
              <p>error get data</p>
            </div>
          )}

          <div className="load-more">
            <button onClick={loadMore} disabled={dataChar?.info?.pages === page || loading || load}>Load More {load && <LoadingButton />}</button>
          </div>
        </div>


        <div className="footer-root">
          <div className="footer-info">
            <div className="text-wrapper">
              <p/><p>Created by Dicky ardiar kurniawan &copy; {new Date().getFullYear()} </p>
            </div>
            <div className="text-wrapper">
              <p/><p>dickyardiar1@gmail.com</p>
            </div>
          </div>
          <button className="repo-button" onClick={() => window.open('https://github.com/Dickyrdiar/jackpat_we_app')}>Repository Code</button>
        </div>
      </ContrainerStyled>
    </>
  )
}

export default Container

const ContrainerStyled = styled.div`
  display: flex;
  flex-direction: column;

  .header-root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    padding: 0 20px;
    background: #ffff;
    
    @media screen and (min-width: 576px) {
      padding: 0 50px;
    }
    transition: 0.3s all ease-in-out;
    .header-title {
      font-size: 22px;
      font-weight: 700;
      margin: 0;
      color: #0f490b;
    }
    .header-right {
      display: none;
      .header-button {
        font-size: 15px;
        font-weight: 500;
        background-color: transparent;
        border: none;
        color: #0f490b;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
          background-color: #0f490b;
          color: white;
        }
        transition: 0.3s all ease-in-out;
      }
      @media screen and (min-width: 576px) {
        display: flex;
      }
    }
  }

  .content-root {
    display: flex;
    margin-top: 100px;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    box-sizing: border-box;
    
    @media screen and (min-width: 700px) {
      padding: 60px 200px;
    }
    transition: 0.3s all ease-in-out;
    .error-fetch {
      display: flex;
      justify-content: center;
      >p {
        width: fit-content;
        color: white;
        background-color: #ff4b4b;
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        padding: 2px 5px;
      }
    }
    .page-detail{
      font-size: 18px;
      font-weight: 600;
      color: #0f490b;
    }
    .char-search {
      display: flex;
      align-items: center;
      justify-content: center;
      /* position: fixed; */
      width: 100%;
      gap: 10px;
      >p {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #0f490b;
      }
      > input {
        padding: 0 10px;
        width: 300px;
        height: 30px;
        border-radius: 5px;
        outline: none;
        border: none;
        background-color: #ecf6ff;
        border: 1px solid #aec4d8;
      }
    }

    .characters-cards { 
      display: grid;
      grid-template-columns: repeat( auto-fill, minmax(180px, 1fr));
      gap: 20px;
      .character-card {
        display: flex;
        cursor: pointer;
        padding: 10px;
        border-radius: 10px;
        flex-direction: column;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px;
        gap: 5px;
        .character-image {
          display: flex;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
        .character-name {
          p {
            font-size: 15px;
            color: #0f490b;
            width: fit-content;
            margin: 0;
            font-weight: 500;
          }
        }
        .character-species {
          display: flex;
          justify-content: flex-end;
          p {
            background-color: #ff961e;
            margin: 0;
            padding: 1px 5px;
            color: white;
            font-size: 13px;
            font-weight: 600;
          }
        }
      }
    }
    .load-more {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      > button {
        display: flex;
        gap: 5px;
        font-size: 15px;
        font-weight: 500;
        padding: 7px 15px;
        border-radius: 8px;
        cursor: pointer;
        background-color: #609acf;
        color: white;
        width: fit-content;
        border: none;
        &:hover {
          background-color: #3c6c99;
        }
        transition: 0.3s all ease-in-out;
      }
    }
  }

  .footer-root {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 60px 20px;
    box-sizing: border-box;
    background: #ffff;
    align-items: center;
    
    @media screen and (min-width: 576px) {
      padding: 60px;
    }
    transition: 0.3s all ease-in-out;
    .footer-info {
      display: flex;
      flex-direction: column;
    }
    .text-wrapper{
      display: flex;
      gap: 10px;
      > p:nth-child(1) {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        width: 60px;
        color: #234564;
      }
      > p:nth-child(2) {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: #234564;
      }
      @media screen and (min-width: 576px) {
        align-items: center;
      }
    }
    .repo-button {
      border-radius: 3px;
      cursor: pointer;
      background-color: #609acf;
      color: white;
      width: fit-content;
      border: none;
      &:hover {
        background-color: #32618d;
      }
      transition: 0.3s all ease-in-out;
    }
  }
`