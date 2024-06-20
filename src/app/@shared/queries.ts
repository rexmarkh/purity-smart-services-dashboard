import { gql } from "graphql-tag";

export const GetOverallList = gql`query { 
    active_bookings (order_by: {booking_id: asc}) {
      user_profile {
        name
        phone
      }
      service_detail {
        name
      }
      vendor_profile{
        name
      }
      booking_id
      booking_date
      service_date
      booking_status {
        name
      }
    }  
  }`

export const vendorList = gql`query {
  vendor_profiles {
    user_id
    name
    phone
    email
    address
    locality
    city
    pincode
    wallet_money
    is_vendor_available
    is_profile_completed
    vendor_services {
      service_detail{
        sid
        name
      }
    }
  }
}`
export const getVendorDetails = (userId: any) => gql`query {
  vendor_profiles(where: {user_id: {_eq: "${userId}"}}) {
    email
    name
    locality
    phone
    address
    city
    pincode
    wallet_money
    is_profile_completed
    aadhar_file_id
    pan_file_id
    aadhar_status {
      id
      name
    }
    pan_status {
      id
      name
    }
    user {
    	displayName
    	avatarUrl
  	}
    vendor_services {
      service_detail {
        sid
        name
      }
  	}
  }
}
`
export const UnAssignedServices = gql`query {
  active_bookings(where: {status: {_lte: "4"}}order_by: {booking_id: desc}) {
    user_profile {
      email
      name
      user_id
    }
    user_address {
      address
      locality
    }
    vendor_profile {
      name
      user_id
    }
    booking_id
    booking_date
    booking_status {
      status_id
      name
    }
    service_date
    service_detail {
      sid
      name
    }
  }
}`

export const CompletedServices = gql`query {
  active_bookings(where: {status: {_gte: "5"}}order_by: {booking_id: desc}) {
    user_profile {
      email
      name
      user_id
    }
    vendor_profile {
      name
      user_id
    }
    booking_id
    booking_status {
      status_id
      name
    }
    service_date
    booking_date
    service_detail {
      name
    }
  }
}`

export const AssignVendor = (booking_id: any, vendor_id: any) => gql`  mutation assignVendor {
  update_active_bookings_by_pk(pk_columns: {booking_id: ${booking_id}}, _set: {status: 2, vendor_id: "${vendor_id}"}) {
    status
  }
}`

export const addVendor = (phoneNumber: any) => gql`mutation MyMutation {
  insert_vendors_list(objects: {phoneNumber: "${phoneNumber}"}) {
    returning {
      phoneNumber
      email
    }
  }
}`

export const GetUserProfile = (userId: any) => {
  return `query {
      user_profiles(where: {user_id: {_eq: "${userId}"}}) {
    		user {
          id
          avatarUrl
          displayName
        }
        name
        email
        phone
        is_profile_completed
    		user_addresses(where:{is_preferred_address: {_eq: true}}) {
          id
          address_name
          address
          locality
          city
          is_preferred_address
        }
      }
    }`;
};

export const IsUserProfileCompleted = (userId: any) => {
  return `query {
      user_profiles(where: {user_id: {_eq: "${userId}"}}) {
        user_id
        name
        phone
        is_profile_completed
      }
    }`;
};

export const GetVendorServices = (vendorId: any) => {
  return `query {
      vendor_services(where: {vendor_id: {_eq: "${vendorId}"}}) {
        id
        service_detail {
          sid
          name
        }
        is_available
      }
    }`;
};

export const serviceDetailsList = `query {
  service_details(order_by: {sid: asc}) {
    image_id
    description
    duration
    name
    price
    share_amount
    sid
    reviews_count
    ratings
    service_category {
      id
      name
    }
  }
}`


export const UpdateServiceDetails = (sid: any, details: any) => gql`  mutation {
  update_service_details(where: {sid: {_eq: "${sid}"}}, _set: {description: "${details.description}", duration: "${details.duration}", name: "${details.name}", price: "${details.price}", share_amount: "${details.share_amount}"}) {
    returning {
      description
    }
  }
}`
export const InsertServiceDetails = (details: any) => gql`  mutation {
  insert_service_details(objects: {description: "${details.description}", duration: "${details.duration}", name: "${details.name}", price: "${details.price}", share_amount: "${details.share_amount}", is_active: true}) {
    returning {
      name
    }
  }
}`

export const InsertVendorService = (serviceData: any) => gql`  mutation {
  insert_vendor_services(objects: {is_available: true, service_id: "${serviceData.service_id}", vendor_id: "${serviceData.vendor_id}"}) {
    affected_rows
  }
}`

export const InsertNewVendor = (vendorData: any) => gql`  mutation {
  insertUser(object: {displayName: "${vendorData.displayName}", email: "${vendorData.email}",locale: "en", phoneNumber: "+91${vendorData.phoneNumber}", phoneNumberVerified: true, defaultRole: "vendor"}) {
    id
    displayName
    phoneNumber
    email
  }
}`

export const InsertNewVendorProfile = (vendorData: any) => gql`  mutation {
  insert_vendor_profiles(objects: {
    user_id: "${vendorData.user_id}",
    name: "${vendorData.name}",
    email: "${vendorData.email}",
    phone: "+91${vendorData.phone}",
    address: "${vendorData.address}",
    locality: "${vendorData.locality}",
    city: "${vendorData.city}",
    pincode: "${vendorData.pincode}",
    wallet_money: "${vendorData.wallet_money}",
    is_profile_completed: "${vendorData.is_profile_completed}",
  }) {
    returning {
      user_id
      name
      phone
    }
  }
}`

export const DeleteVendor = (user_id) => gql `mutation {
  delete_vendor_profiles_by_pk(user_id: "${user_id}") {
    user_id
    name
  }
}`

export const DeleteVendorServices = (user_id) => gql `mutation {
  delete_vendor_services(where: {vendor_id: {_eq: "${user_id}"}}) {
    affected_rows
  }
}`

export const GetAutoSuggestedVendor = (data: any) => `query MyQuery {
  vendor_services(where: {service_id: {_eq: "${data.service_id}"}, vendor_profile: {locality: {_eq: "${data.locality}"}}}) {
    vendor_profile {
      user_id
      name
      phone
    }
  }
}`


export const getOfferDetails = `query{
  offers {
    id
    coupon_code
    description
    discount
    is_valid
    title
    service_detail {
      name
      sid
    }
  }
}`

export const UpdateOfferDetails = (id: any, details: any) => gql`  mutation {
  update_offers(where: {id: {_eq: ${id}}}, _set: {description: "${details.description}", coupon_code: "${details.coupon_code}", discount: "${details.discount}", is_valid: "${details.is_valid}", title: "${details.title}",service_id: "${details.service_detail.sid}" }) {
    returning {
      description
    }
  }
}`

export const InsertOfferDetails = (details: any) => gql`  mutation {
  insert_offers(objects: {description: "${details.description}", coupon_code: "${details.coupon_code}", discount: "${details.discount}", is_valid: "${details.is_valid}", title: "${details.title}",service_id: "${details.service_detail.sid}" }) {
    returning {
      description
    }
  }
}`

export const UpdateVendorDetails = (vendor_details: any) => gql`  mutation {
  update_vendor_profiles(where: {user_id: {_eq: "${vendor_details.user_id}"}}, _set: {
    name: "${vendor_details.name}",
    phone: "${vendor_details.phone}",
    email: "${vendor_details.email}",
    address: "${vendor_details.address}",
    locality: "${vendor_details.locality}",
    city: "${vendor_details.city}",
    pincode: "${vendor_details.pincode}",
    wallet_money: ${vendor_details.wallet_money},
    aadhar_file_status: ${vendor_details.aadhar_file_status},
    pan_file_status: ${vendor_details.pan_file_status}
  } ) {
    affected_rows
  }
}`

export const mySubs = gql `subscription MySubscription {
  user_addresses {
    id
    address_name
    address
    is_preferred_address
    locality
    city
  }
}`


export const UpdateUserProfile = (profileData: any) => {
  return gql `mutation {
    update_user_profiles_by_pk(pk_columns: {user_id: "${profileData.user_id}"}, 
    _set: {
      name: "${profileData.name}",
      phone: "${profileData.phone}",
      email: "${profileData.email}"
    }) {
      name
      phone
      email
    }
  }`;
};

export const UpdateUserAddress = (addressData: any) => {
  return `mutation UpdateAddressById {
    update_user_addresses_by_pk(pk_columns: {id: "${addressData.address_id}"}, _set: {
      user_id: "${addressData.user_id}",
      address_name: "${addressData.address_name}",
      address: "${addressData.address}",
      city: "${addressData.city}",
      locality: "${addressData.locality}",
      is_preferred_address: "${addressData.is_preferred_address}"
    }) {
      id
      user_id
      address_name
      address
      city
      locality
      is_preferred_address
    }
  }`;
};
export const AddUserAddress = (addressData: any) => {
  return `mutation addAddress {
    insert_user_addresses(objects: {
      user_id: "${addressData.user_id}",
      address_name: "${addressData.address_name}",
      address: "${addressData.address}",
      city: "${addressData.city}",
      locality: "${addressData.locality}",
      is_preferred_address: ${addressData.is_preferred_address}
    }) {
      returning {
          address
          address_name
          city
          id
          is_preferred_address
          locality
          user_id
      }
    }
  }`;
};

export const CreateUserProfile = (profileData: any) => {
  return `mutation createUserProfile {
     insert_user_profiles(objects: {
      user_id: "${profileData.user_id}",
      name: "${profileData.name}",
      phone: "${profileData.phone}",
      email: "${profileData.email}",
      is_profile_completed: true,
      user_addresses: {
        data: {
          address_name: "Home",
          address: "${profileData.address}",
          locality: "${profileData.locality}",
          city: "${profileData.city}",
          is_preferred_address: ${profileData.is_preferred_address}
        }
      }}) {
     returning {
      name
      phone
      is_profile_completed
      user_id
     }
     }
    }`;
};

export const ServiceBooking = (bookingData: any) => {
  return `mutation {
    insert_active_bookings(objects: {
      user_id: "${bookingData.user_id}",
      service_id: "${bookingData.service_id}",
      service_date: "${bookingData.service_date}",
      address_id: "${bookingData.address_id}",
      otp: "${bookingData.otp}"
    }) {
      returning {
        address_id
        booking_date
        booking_id
        service_date
        service_id
        status
        user_id
        vendor_id
        otp
        service_detail {
          name
          sid
        }
      }
    }
  }`;
};

export const GetUserBookingsList = (user_id: string) => {
  return `query {
      active_bookings(order_by: {booking_id: desc}, where: {user_id: {_eq: "${user_id}"}}) {
        booking_id
        booking_date
        service_date
        user_id
        otp
        booking_status {
          status_id
          name
        }
        user_address {
          id
          address_name
          address
          locality
          city
        }
        vendor_profile {
          user_id
          name
          phone
        }
        service_detail {
          sid
          name
          description
          duration
          price
        }
      }
    }`;
};

export const GetServiceReview = (service_id: any) => {
  return `query {
    user_reviews(limit: 10, order_by: {id: desc}, where: {service_id: {_eq: "${service_id}"}}) {
      service_id    
      booking_id
      rating
      date
      comment
      user_profile {
        user_id
        name
        user_pic
      }
    }
  }`;
};

export const GetUserServiceReview = (user_id: any) => {
  return `query {
    user_reviews(limit: 10, order_by: {id: desc}, where: {user_id: {_eq: "${user_id}"}}) {
          user_id
          rating
          date
          comment
          booking_id
          user_profile {
            user_pic
            name
          }
          booking_id
      		active_booking {
            service_date
            service_detail{
              name
            }
          }
      }
  }`;
};