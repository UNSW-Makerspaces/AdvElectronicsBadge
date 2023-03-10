cmake_minimum_required(VERSION 3.13)
set(PICO_SDK_FETCH_FROM_GIT on)
include(cmake/pico_sdk_import.cmake)

if(
    (
    (DEFINED ENV{PICOGAMEPAD_PROJECT_NAME})
    AND 
    (DEFINED ENV{PICOGAMEPAD_PROJECT_VERSION})
    )
  )
  message(STATUS "[PICOGAMEPAD]: " $ENV{PICOGAMEPAD_PROJECT_NAME})
  message(STATUS "[PICOGAMEPAD]: " $ENV{PICOGAMEPAD_PROJECT_VERSION})
else() 
  message(FATAL_ERROR "[PICOGAMEPAD][BUILD]: NO PICOGAMEPAD BUILD ENV. SOURCE env AND REBUILD")
endif() 


project(
  $ENV{PICOGAMEPAD_PROJECT_NAME}
  VERSION $ENV{PICOGAMEPAD_PROJECT_VERSION}
  LANGUAGES CXX C ASM
)

#  as
set(CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/cmake" ${CMAKE_MODULE_PATH})

# Only do these if this is the main project, and not if it is included through add_subdirectory
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)

  # Optionally set things like CMAKE_CXX_STANDARD, CMAKE_POSITION_INDEPENDENT_CODE here

  # Let's ensure -std=c++xx instead of -std=g++xx
  #set(CMAKE_CXX_EXTENSIONS OFF)

  # Let's nicely support folders in IDEs
  set_property(GLOBAL PROPERTY USE_FOLDERS ON)

  set(CMAKE_C_STANDARD 11)
  set(CMAKE_CXX_STANDARD 17)
  set(PICO_SDK_PATH "/usr/share/pico-sdk")
  set(PICO_CXX_ENABLE_EXCEPTIONS 1)

  set(PICO_CXX_ENABLE_RTTI 1)

  pico_sdk_init()

endif()


# FetchContent added in CMake 3.11, downloads during the configure step
# FetchContent_MakeAvailable was added in CMake 3.14; simpler usage
include(FetchContent)

include(fetchLibs)

# The compiled library code is here
add_subdirectory(src)

if((CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME OR MODERN_CMAKE_BUILD_TESTING)
  AND BUILD_TESTING)
#FIXME: 
#add_subdirectory(tests)
endif()




