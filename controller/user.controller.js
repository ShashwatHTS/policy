const { supabaseInstance } = require("../supabase-db/index")

// exports.createPolicy = async (req, res) => {
//     try {
//         const body = req.body;
//         console.log("body", body)
//         const { data, error } = await supabaseInstance.auth.signUp(body)
//         if (error) {
//             console.log("error", error)
//         }
//         console.log("w => ", data);
//         if (data?.user) {
//             console.log("data=>", data.user.id)
//             const auth_id = data.user.id

//             const userResponse = await supabaseInstance.from('policies').insert({ ...body, auth_id }).select("*");

//             if (userResponse) {
//                 console.log("userResponse => ", userResponse)
//                 res.send(userResponse)

//             } else {
//                 console.log("error")
//             }
//         }
//     } catch (error) {
//         throw new Error(error)
//     }


// }

// supabase.auth.update({
//     id: userId,
//     role: 'starter_role', // Update user's role
// });

// exports.createTranction = async (req, res) => {
//     try {
//         const body = req.body;
//         console.log("body", body)
//         const currentTime = new Date()
//         const expiryTime = new Date(Date.now() + 1 * 60 * 1000)
//         const admin = await supabaseInstance.from("tanscation").insert({ ...body, expiry: expiryTime, currentTime: currentTime }).select(`*`).maybeSingle();
//         console.log("HHHHHH")
//         console.log("w => ", admin);
//         if (!admin) {
//             console.log("error")
//         }
//         setTimeout(async () => {
//             const expiredUser = await supabaseInstance.from("tanscation").update({ status: true }).select("*").eq("id", admin.data.id).maybeSingle();
//             if (expiredUser) {
//                 expiredUser.expired = true;
//                 console.log(`User ${admin.data.id} expired at ${new Date()}`);
//             }
//             console.log("expiredUser => ", expiredUser)
//         }, 1 * 60 * 1000);
//         //   console.log("admin => ", admin)
//         res.send(admin.data)
//     } catch (error) {
//         throw new Error(error)
//     }
//     return
// }
// exports.updateTranction = async (req, res) => {
//     try {
//         const body = req.body;
//         console.log("body", body)
//         const admin = await supabaseInstance.from("tanscation").update(body).eq("id", req.params.id).select(`*`).maybeSingle();
//         console.log("HHHHHH")
//         console.log("w => ", admin);
//         if (!admin) {
//             console.log(error)
//         }
//         res.send(admin)
//     } catch (error) {
//         throw new Error(error)
//     }
//     return
// }



// async function executeTransaction() {
//   try {
//     // Start a new batch
//     const { data, error } = await supabaseInstance.createTransaction();

//     if (error) {
//       throw error;
//     }

//     // Execute multiple queries in the batch
//     const query1 = supabase
//       .from('table_name')
//       .insert({ column1: 'value1', column2: 'value2' });

//     const query2 = supabase
//       .from('table_name')
//       .update({ column1: 'new_value1', column2: 'new_value2' })
//       .eq('id', 123);

//     // Add queries to the batch
//     data.batch = [query1, query2];

//     // Execute the batch
//     const response = await supabase.request.post('/batch', { batch: data.batch });

//     // Check for errors in batch execution
//     if (response.error) {
//       throw response.error;
//     }

//     // Commit the transaction (batch)
//     await supabase.commitTransaction();

//     console.log('Transaction executed successfully');
//   } catch (error) {
//     console.error('Error executing transaction:', error.message);

//     // Rollback the transaction (batch) if an error occurs
//     await supabase.rollbackTransaction();

//     console.log('Transaction rolled back');
//   }
// }

// Call the function to execute the transaction
// executeTransaction();


// async function executeTransaction(trans_money, to_id, from_id) {
//     try {
//       // Begin transaction
//       const result = await supabaseInstance.rpc('trc', { trans_money: trans_money, to_id: to_id, from_id: from_id });
//     //   console.log("result------->", result?.error?.message)
//     console.log("result------->", result.status)

//       // Commit the transaction

//       console.log('Transaction executed successfully');
//     } catch (error) {
//       console.error('Error executing transaction:', error.message);
//     //   console.log('Transaction rolled back');
//     }
//   }

//   // Call the function to execute the transaction
//   executeTransaction(1000000,2,1);
//   executeTransaction(100,2,1);




// async function executeTransaction(trans_money, from_id, to_id) {
//     try {
//         // Begin transaction
//         const result = await supabaseInstance.rpc('trc', { trans_money: trans_money, from_id: from_id, to_id: to_id });

//         console.log("result------->", result?.status)
//         //   const balance = await getAccountBalance(from_id);
//         //   console.log("balance => ", balance)
//         //   if (balance-trans_money >= 0) {
//         // Commit the transaction
//         // console.log('Transaction executed successfully');
//         //   } else {
//         // console.log('Transaction rolled back: Negative balance');
//         //   }
//     } catch (error) {
//         console.error('Error executing transaction:', error.message);
//         console.log('Transaction rolled back');
//     }
// }

// Function to get the account balance
// async function getAccountBalance(account_id) {
//     try {
//         const { data, error } = await supabaseInstance
//             .from('accounts')
//             .select('balance')
//             .eq('id', account_id)
//             .single();

//         if (error) {
//             throw error;
//         }

//         return data.balance;
//     } catch (error) {
//         console.error('Error fetching account balance:', error.message);
//         throw error;
//     }
// }

// Call the function to execute the transaction
// executeTransaction(1000000, 2, 1);
// executeTransaction(100, 2, 1);

// exports.bookingRPC = async (req, res) => {
//     try {
//         const { amount_paid, new_id } = req.body;
//         const { data, error } = await supabaseInstance
//             .rpc('update_transaction_amounts', { amount_paid, new_id });
//         const time  = new Date().toLocaleString()
//         console.log("time---> ", time)
//         if (error) {
//             throw error;
//         }

//         res.status(200).json(data);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: error.message })
//     }
// }




exports.uploadImage = async (req, res) => {
    try {
        const body = req.body;
        console.log("body", body)
        const { data, error } = await supabaseInstance.auth.signUp(body)
        if (error) {
            console.log("error", error)
        }
        console.log("w => ", data);
        if (data?.user) {
            console.log("data=>", data.user.id)
            const auth_id = data.user.id

            const userResponse = await supabaseInstance.from('policies').insert({ ...body, auth_id }).select("*");

            if (userResponse) {
                console.log("userResponse => ", userResponse)
                res.send(userResponse)

            } else {
                console.log("error")
            }
        }
    } catch (error) {
        throw new Error(error)
    }


}