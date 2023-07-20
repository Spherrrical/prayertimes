// pages/index.tsx
"use client";
import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import {format, getTime} from 'date-fns';
import fetchPrayerTimes from './utils/api';
import Link from "next/link";
import {date} from "zod";


const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<Record<string, string> | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>(''); // State to store current location
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(new Date());

  const findNextPrayer = (prayerTimes: Record<string, string>): string => {
    const currentTime = new Date();
    const formattedCurrentTime = format(currentTime, 'HH:mm');

    const sortedPrayerTimes = Object.entries(prayerTimes).sort(
        ([, timeA], [, timeB]) => (timeA > timeB ? 1 : -1)
    );

    for (const [prayer, time] of sortedPrayerTimes) {
      if (time > formattedCurrentTime) {
        return prayer;
      }
    }

    return sortedPrayerTimes[0][0];
  };

  const nextPrayer = prayerTimes ? findNextPrayer(prayerTimes) : '';


  useEffect(() => {
    const timer = setInterval(()=>setDate(new Date()), 1000 )
    return function cleanup() {
      clearInterval(timer)
    }

  });

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  useEffect(() => {
    const fetchPrayerTimesData = async (latitude: number, longitude: number) => {
      try {
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'dd-MM-yyyy');
        const prayerTimesData = await fetchPrayerTimes(latitude, longitude);
        setPrayerTimes(prayerTimesData);
      } catch (error) {
        console.error(error);
      }
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentLocation(e.target.value);
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
              fetchPrayerTimesData(latitude, longitude);
            },
            (error) => {
              console.error(error);
            }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  const formatTimeToAMPM = (time: string) => {
    return format(new Date(`1970-01-01T${time}`), 'h:mm a');
  };

  return (
      <div className="flex justify-center bg-slate-900 items-center h-screen">
        {prayerTimes ? (
            <div className="text-center tracking-tight">


              <div className="text-3xl">
                <strong className="text-white font-semibold">Current Time </strong>
                <p className="py-1"/>
                <strong className="text-5xl">{date.toLocaleTimeString()}</strong>
              </div>

              <p className="py-4" />
              <div className="text-2xl">
                <strong className="text-white font-semibold">
                  Next prayer is
                </strong>
                <strong className="text-cyan-500 font-semibold">
                  &nbsp;{nextPrayer === 'Fajr' ? 'Next Prayer' : `${nextPrayer}`}
                </strong>
                <p className="py-1" />
                <strong className="text-5xl">
                  {formatTimeToAMPM(prayerTimes[nextPrayer])}
                </strong>
              </div>

              <p className="py-6"/>

              <div className="text-2xl">
                <strong className="text-cyan-500 font-semibold tracki">Fajr </strong>
                <p className="py-1"/>
                <strong className="text-3xl text-gray-300">{formatTimeToAMPM(prayerTimes.Fajr)}</strong>
              </div>

              <p className="py-4"/>

              <div className="text-2xl">
                <strong className="text-cyan-500 font-semibold">Dhuhr </strong>
                <p className="py-1"/>
                <strong className="text-3xl text-gray-300">{formatTimeToAMPM(prayerTimes.Dhuhr)}</strong>
              </div>

              <p className="py-4"/>

              <div className="text-2xl">
                <strong className="text-cyan-500 font-semibold">Asr </strong>
                <p className="py-1"/>
                <strong className="text-3xl text-gray-300">{formatTimeToAMPM(prayerTimes.Asr)}</strong>
              </div>

              <p className="py-4"/>

              <div className="text-2xl">
                <strong className="text-cyan-500 font-semibold">Maghrib </strong>
                <p className="py-1"/>
                <strong className="text-3xl text-gray-300">{formatTimeToAMPM(prayerTimes.Maghrib)}</strong>
              </div>

              <p className="py-4"/>

              <div className="text-2xl">
                <strong className="text-cyan-500 font-semibold">Isha </strong>
                <p className="py-1"/>
                <strong className="text-3xl text-gray-300">{formatTimeToAMPM(prayerTimes.Isha)}a</strong>
              </div>


              <p className="py-4"/>
              <button
                  type="button"
                  onClick={openModal}
                  className="mt-4 tracking-tight rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                Settings
              </button>
            </div>
        ) : (
            <div>
              <p className="text-gray-200 font-bold text-3xl tracking-tight justify-center mx-auto flex text-center">Loading...</p>
              <div className="items-center justify-center mx-auto flex mt-5">
                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-600"
                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"/>
                  <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"/>
                </svg>
              </div>
            </div>


        )}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-950 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-center text-white"
                    >
                      Location Information
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-center">
                        Your current location is:
                      </p>
                      <p className="text-sm text-gray-300 text-center">
                        {currentLocation}
                      </p>
                      <p className="text-sm text-gray-500 text-center mt-3">
                        The date is:
                      </p>
                      <p className="text-sm text-gray-300 text-center">
                        {date.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-5 text-center justify-center flex mx-auto">
                      <button
                          type="button"
                          className="flex justify-center text-center rounded-md border border-transparent bg-slate-900 px-4 py-2 text-sm font-medium text-cyan-500 hover:bg-slate-800 "
                          onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>



  );
};


{/*<h2>Other Times:</h2>*/}
{/*<ul>*/}
{/*  <li>*/}
{/*    <strong>Sunrise: </strong> {formatTimeToAMPM(prayerTimes.Sunrise)}*/}
{/*  </li>*/}
{/*  <li>*/}
{/*    <strong>Sunset: </strong> {formatTimeToAMPM(prayerTimes.Sunset)}*/}
{/*  </li>*/}
{/*  <li>*/}
{/*    <strong>Midnight: </strong> {formatTimeToAMPM(prayerTimes.Midnight)}*/}
{/*  </li>*/}
{/*</ul>*/}

export default PrayerTimes;
